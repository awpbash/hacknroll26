const cloudServices = require('../data/cloudServices');

class ArchitectureEvaluator {
  constructor(submission, challenge, useLLM = false) {
    this.submission = submission;
    this.challenge = challenge;
    this.feedback = [];
    this.errors = [];
    this.useLLM = useLLM;
  }

  async evaluate() {
    const { architecture, provider } = this.submission;

    // Calculate total cost
    const cost = this.calculateCost(architecture, provider);

    // Calculate complexity score (number of components and connections)
    const complexity = architecture.nodes.length + architecture.edges.length;

    // Validate architecture meets requirements
    const validationResult = this.validateArchitecture(architecture, provider);

    // Check if cost is within budget
    if (cost > this.challenge.constraints.maxCost) {
      this.errors.push(`Cost ($${cost.toFixed(2)}) exceeds maximum budget ($${this.challenge.constraints.maxCost})`);
      return {
        passed: false,
        cost,
        complexity,
        score: 0,
        feedback: this.feedback,
        errors: this.errors,
        status: 'Too Expensive'
      };
    }

    // Check if all required services are present
    if (!validationResult.valid) {
      this.errors.push(...validationResult.errors);
      return {
        passed: false,
        cost,
        complexity,
        score: 0,
        feedback: this.feedback,
        errors: this.errors,
        status: 'Wrong Architecture'
      };
    }

    // Calculate score: lower cost and lower complexity = higher score
    // Score = 1000 - (cost_ratio * 500) - (complexity_ratio * 300) + bonus
    const costRatio = cost / this.challenge.constraints.maxCost;
    const optimalComplexity = this.challenge.optimalSolution?.complexity || complexity;
    const complexityRatio = complexity / (optimalComplexity * 2); // Allow up to 2x optimal complexity

    let score = 1000 - (costRatio * 500) - (Math.min(complexityRatio, 1) * 300);

    // Bonus points for efficiency
    if (costRatio < 0.5) {
      score += 100;
      this.feedback.push("Excellent cost optimization! 🎉");
    }

    if (complexity <= optimalComplexity) {
      score += 50;
      this.feedback.push("Great architectural simplicity!");
    }

    // Ensure score is not negative
    score = Math.max(0, Math.round(score));

    this.feedback.push(`Total cost: $${cost.toFixed(2)}/month`);
    this.feedback.push(`Architecture complexity: ${complexity} components`);
    this.feedback.push(`Efficiency score: ${score}/1000`);

    return {
      passed: true,
      cost,
      complexity,
      score,
      feedback: this.feedback,
      errors: this.errors,
      status: 'Accepted'
    };
  }

  calculateCost(architecture, provider) {
    const services = cloudServices[provider];
    if (!services) return 0;

    let totalCost = 0;
    const hoursPerMonth = 730; // Average hours in a month

    architecture.nodes.forEach(node => {
      // Find the service in the cloud services data
      let service = null;
      for (const category in services) {
        service = services[category].find(s => s.id === node.type);
        if (service) break;
      }

      if (service) {
        // Calculate monthly cost based on service type
        if (service.category === 'compute') {
          totalCost += service.cost * hoursPerMonth;
        } else if (service.category === 'storage') {
          // Assume 10GB default storage
          totalCost += service.cost * 10;
        } else if (service.category === 'serverless') {
          // Assume 1M requests/month
          totalCost += service.cost * 1000000;
        } else if (service.category === 'database') {
          if (service.id.includes('dynamodb')) {
            totalCost += service.cost; // DynamoDB cost is per million writes
          } else {
            totalCost += service.cost * hoursPerMonth;
          }
        } else if (service.category === 'networking') {
          if (service.cost === 0) {
            // Free service
          } else if (service.id.includes('cdn') || service.id.includes('cloudfront')) {
            // CDN: assume 100GB bandwidth
            totalCost += service.cost * 100;
          } else {
            totalCost += service.cost * hoursPerMonth;
          }
        } else if (service.category === 'messaging') {
          // Assume 1M messages/month
          totalCost += service.cost * 1000000;
        } else if (service.category === 'cache') {
          totalCost += service.cost * hoursPerMonth;
        } else {
          totalCost += service.cost;
        }
      }
    });

    return totalCost;
  }

  validateArchitecture(architecture, provider) {
    const errors = [];
    const { requiredServices } = this.challenge.constraints;

    // Check if architecture has nodes
    if (!architecture.nodes || architecture.nodes.length === 0) {
      errors.push("Architecture must contain at least one component");
      return { valid: false, errors };
    }

    // Get service categories used in the architecture
    const services = cloudServices[provider];
    if (!services) {
      errors.push(`Provider ${provider} not supported`);
      return { valid: false, errors };
    }

    const usedCategories = new Set();
    architecture.nodes.forEach(node => {
      for (const category in services) {
        const service = services[category].find(s => s.id === node.type);
        if (service) {
          usedCategories.add(service.category);
        }
      }
    });

    // Check if required service categories are present
    requiredServices.forEach(required => {
      if (!usedCategories.has(required)) {
        errors.push(`Missing required service category: ${required}`);
      }
    });

    // Validate that components are connected (for non-trivial architectures)
    if (architecture.nodes.length > 1 && architecture.edges.length === 0) {
      errors.push("Components must be connected to form a valid architecture");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = ArchitectureEvaluator;
