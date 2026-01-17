const cloudServices = require('../data/cloudServices');
const LLMEvaluator = require('./llmEvaluator');

/**
 * Architecture Evaluator - Three-Phase Evaluation System
 *
 * Phase 1 (REQUIRED): Basic validation - cost, connectivity, required services, complexity
 *                     STOPS evaluation if fails
 *
 * Phase 2 (RECOMMENDED): Rule-based pattern validation - best practices checks
 *                        Adds warnings and score penalties, doesn't stop
 *
 * Phase 3 (OPTIONAL): LLM-based deep evaluation - functionality, scalability, cost, practices
 *                     Provides detailed feedback and score adjustments
 *
 * Usage:
 *   // Without LLM
 *   const evaluator = new ArchitectureEvaluator(submission, challenge);
 *   const result = await evaluator.evaluate();
 *
 *   // With LLM (Phase 3)
 *   const evaluator = new ArchitectureEvaluator(
 *     submission,
 *     challenge,
 *     true,  // useLLM
 *     { apiKey: 'your-api-key', provider: 'anthropic' }  // or 'openai'
 *   );
 *   const result = await evaluator.evaluate();
 */
class ArchitectureEvaluator {
  constructor(submission, challenge, useLLM = false, llmConfig = null) {
    this.submission = submission;
    this.challenge = challenge;
    this.feedback = [];
    this.errors = [];
    this.useLLM = useLLM;
    this.llmConfig = llmConfig; // { apiKey, provider: 'anthropic' | 'openai' }
  }

  async evaluate() {
    // Phase 1: Basic Validation (REQUIRED)
    const phase1 = await this.evaluatePhase1();

    if (!phase1.passed) {
      // Failed Phase 1 - return immediately
      return {
        passed: false,
        cost: phase1.cost,
        complexity: phase1.complexity,
        score: 0,
        feedback: [],
        errors: phase1.errors,
        status: phase1.status,
        phases: {
          phase1: phase1
        }
      };
    }

    // Phase 2: Rule-Based Validation (RECOMMENDED)
    const phase2 = this.evaluatePhase2();

    // Phase 3: LLM-Based Evaluation (OPTIONAL)
    let phase3 = null;
    if (this.useLLM && this.llmConfig) {
      console.log('✓ Phase 3 enabled - starting LLM evaluation');
      phase3 = await this.evaluatePhase3();
    } else {
      console.log('⊗ Phase 3 disabled - skipping LLM evaluation');
    }

    // Calculate score with all phases
    const score = this.calculateScoreWithPhases(phase1, phase2, phase3);

    // Build feedback array
    const feedback = [];
    feedback.push(`Total cost: $${phase1.cost.toFixed(2)}/month`);
    feedback.push(`Architecture complexity: ${phase1.complexity} components`);

    if (phase2.warnings.length > 0) {
      feedback.push(`⚠️ ${phase2.warnings.length} architectural warning(s) found`);
    } else {
      feedback.push('✓ All architectural best practices followed');
    }

    // Add LLM feedback if available
    if (phase3 && phase3.llmFeedback) {
      const llm = phase3.llmFeedback;
      if (llm.summary) {
        feedback.push(`\n🤖 AI Analysis: ${llm.summary}`);
      }
      if (llm.strengths && llm.strengths.length > 0) {
        feedback.push(`\n✅ Strengths: ${llm.strengths.join('; ')}`);
      }
      if (llm.issues && llm.issues.length > 0) {
        feedback.push(`\n⚠️ Issues: ${llm.issues.join('; ')}`);
      }
    }

    feedback.push(`Efficiency score: ${score}/1000`);

    // Cost efficiency bonus feedback
    const costRatio = phase1.cost / this.challenge.constraints.maxCost;
    if (costRatio < 0.5) {
      feedback.push("Excellent cost optimization!");
    }

    const result = {
      passed: true,
      cost: phase1.cost,
      complexity: phase1.complexity,
      score: score,
      feedback: feedback,
      errors: [],
      status: 'Accepted',
      phases: {
        phase1: phase1,
        phase2: phase2
      }
    };

    if (phase3) {
      result.phases.phase3 = phase3;
    }

    return result;
  }

  calculateCost(architecture, provider) {
    const services = cloudServices[provider];
    if (!services) return 0;

    let totalCost = 0;
    const hoursPerMonth = 730; // Average hours in a month

    architecture.nodes.forEach(node => {
      // Extract service ID from node ID (format: aws-cloudfront-1768664069239 -> cloudfront)
      const nodeId = node.id || '';
      const parts = nodeId.split('-');
      let serviceId = '';
      if (parts.length >= 3) {
        serviceId = parts.slice(1, -1).join('-');
      }

      // Find the service in the cloud services data
      let service = null;
      for (const category in services) {
        service = services[category].find(s => s.id === serviceId);
        if (service) break;
      }

      if (service) {
        console.log(`[Evaluator] Calculating cost for ${service.name}: base cost $${service.cost}`);
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
        } else if (service.category === 'ai') {
          // AI cost calculation based on pricing model
          if (service.specs.includes('Per request') || service.specs.includes('Per 1K')) {
            // Request-based pricing (assume 1M requests/month)
            totalCost += service.cost * 1000000;
          } else if (service.specs.includes('Per image')) {
            // Image processing (assume 10K images/month)
            totalCost += service.cost * 10000;
          } else if (service.specs.includes('Per hour') || service.specs.includes('VRAM')) {
            // GPU/compute (hourly pricing)
            totalCost += service.cost * hoursPerMonth;
          } else {
            // Default to hourly
            totalCost += service.cost * hoursPerMonth;
          }
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
      // Extract service ID from node ID
      const nodeId = node.id || '';
      const parts = nodeId.split('-');
      let serviceId = '';
      if (parts.length >= 3) {
        serviceId = parts.slice(1, -1).join('-');
      }

      for (const category in services) {
        const service = services[category].find(s => s.id === serviceId);
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

  // Phase 1: Basic Validation Methods
  validateConnectivity() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    // Empty architecture
    if (nodes.length === 0) {
      return { passed: false, error: 'Architecture is empty' };
    }

    // Single node is valid
    if (nodes.length === 1) {
      return { passed: true };
    }

    // Multiple nodes must have edges
    if (edges.length === 0) {
      return {
        passed: false,
        error: 'Components must be connected'
      };
    }

    // Check for orphaned nodes (no connections)
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const orphanedNodes = nodes.filter(node =>
      !connectedNodeIds.has(node.id)
    );

    if (orphanedNodes.length > 0) {
      const names = orphanedNodes
        .map(n => n.data?.label || n.type)
        .join(', ');
      return {
        passed: false,
        error: `Disconnected components: ${names}`
      };
    }

    // Check if fully connected (BFS)
    if (!this.isFullyConnected()) {
      return {
        passed: false,
        error: 'Architecture has multiple disconnected groups'
      };
    }

    return { passed: true };
  }

  isFullyConnected() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    if (nodes.length <= 1) return true;

    // Build adjacency list (treat as undirected)
    const graph = {};
    nodes.forEach(node => {
      graph[node.id] = [];
    });

    edges.forEach(edge => {
      graph[edge.source] = graph[edge.source] || [];
      graph[edge.target] = graph[edge.target] || [];
      graph[edge.source].push(edge.target);
      graph[edge.target].push(edge.source);
    });

    // BFS from first node
    const visited = new Set();
    const queue = [nodes[0].id];
    visited.add(nodes[0].id);

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = graph[current] || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return visited.size === nodes.length;
  }

  validateComplexity() {
    const nodes = this.submission.architecture.nodes;

    // Only count NEW nodes (not existing infrastructure)
    const newNodes = nodes.filter(n => !n.data?.isExisting);
    const nodeCount = newNodes.length;

    const { minServices, maxServices } = this.challenge.constraints;

    // Use defaults if not specified
    const min = minServices || 1;
    const max = maxServices || 20;

    if (nodeCount < min) {
      return {
        passed: false,
        error: `Too few new services: ${nodeCount} (minimum: ${min})`
      };
    }

    if (nodeCount > max) {
      return {
        passed: false,
        error: `Too many new services: ${nodeCount} (maximum: ${max})`
      };
    }

    return { passed: true };
  }

  validateCost(cost) {
    if (cost > this.challenge.constraints.maxCost) {
      return {
        passed: false,
        error: `Cost ($${cost.toFixed(2)}) exceeds maximum budget ($${this.challenge.constraints.maxCost})`
      };
    }
    return { passed: true };
  }

  validateRequiredServices() {
    const { requiredServices } = this.challenge.constraints;
    const nodes = this.submission.architecture.nodes;
    const provider = this.submission.provider;
    const services = cloudServices[provider];

    if (!services) {
      return {
        passed: false,
        error: `Provider ${provider} not supported`
      };
    }

    const usedCategories = new Set();
    nodes.forEach(node => {
      // Extract service ID from node ID (format: aws-cloudfront-1768664069239 -> cloudfront)
      // Node ID format: [provider]-[service-id]-[timestamp]
      const nodeId = node.id || '';
      const parts = nodeId.split('-');

      // Remove provider prefix and timestamp suffix
      // For "aws-cloudfront-1768664069239", we want "cloudfront"
      // For "aws-s3-standard-1768664074260", we want "s3-standard"
      let serviceId = '';
      if (parts.length >= 3) {
        // Remove first part (provider) and last part (timestamp)
        serviceId = parts.slice(1, -1).join('-');
      }

      console.log(`[Evaluator] Checking node ${node.id} -> extracted service ID: ${serviceId}`);

      // Find matching service in cloudServices
      for (const category in services) {
        const service = services[category].find(s => s.id === serviceId);
        if (service) {
          console.log(`[Evaluator] ✓ Found service: ${service.name} (category: ${service.category})`);
          usedCategories.add(service.category);
        }
      }
    });

    console.log(`[Evaluator] Used categories: ${Array.from(usedCategories).join(', ')}`);
    console.log(`[Evaluator] Required categories: ${requiredServices.join(', ')}`);

    const missingServices = requiredServices.filter(required =>
      !usedCategories.has(required)
    );

    if (missingServices.length > 0) {
      return {
        passed: false,
        error: `Missing required service categories: ${missingServices.join(', ')}`
      };
    }

    return { passed: true };
  }

  async evaluatePhase1() {
    const result = {
      phase: 1,
      passed: false,
      errors: [],
      cost: 0,
      complexity: 0,
      timestamp: new Date()
    };

    // 1. Calculate cost (only for NEW nodes, not existing)
    const nodes = this.submission.architecture.nodes;
    const newNodes = nodes.filter(n => !n.data?.isExisting);

    // Create temporary architecture with only new nodes for cost calculation
    const newArchitecture = {
      nodes: newNodes,
      edges: this.submission.architecture.edges
    };
    result.cost = this.calculateCost(newArchitecture, this.submission.provider);

    // 2. Validate cost (STOP on fail)
    const costCheck = this.validateCost(result.cost);
    if (!costCheck.passed) {
      result.errors.push(costCheck.error);
      result.status = 'Too Expensive';
      return result;
    }

    // 3. Validate required services (STOP on fail)
    const servicesCheck = this.validateRequiredServices();
    if (!servicesCheck.passed) {
      result.errors.push(servicesCheck.error);
      result.status = 'Wrong Architecture';
      return result;
    }

    // 4. Validate connectivity (STOP on fail)
    const connectivityCheck = this.validateConnectivity();
    if (!connectivityCheck.passed) {
      result.errors.push(connectivityCheck.error);
      result.status = 'Incomplete';
      return result;
    }

    // 5. Validate complexity (STOP on fail)
    result.complexity = newNodes.length;  // Only count new nodes
    const complexityCheck = this.validateComplexity();
    if (!complexityCheck.passed) {
      result.errors.push(complexityCheck.error);
      result.status = 'Wrong Architecture';
      return result;
    }

    // Phase 1 PASSED
    result.passed = true;
    result.status = 'Accepted';
    return result;
  }

  // Phase 2: Rule-Based Pattern Validation
  checkDatabaseExposure() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    const databases = nodes.filter(n =>
      this.getServiceCategory(n) === 'database'
    );

    for (const db of databases) {
      const incomingEdges = edges.filter(e => e.target === db.id);

      // No incoming = publicly exposed
      if (incomingEdges.length === 0) {
        return {
          passed: false,
          warning: `Database (${db.data?.label || db.type}) should not be publicly accessible`
        };
      }

      // Check if connects directly to CDN/LB (bad)
      for (const edge of incomingEdges) {
        const source = nodes.find(n => n.id === edge.source);
        const sourceService = this.getServiceDetails(source);

        if (sourceService?.id?.includes('cdn') ||
            sourceService?.id?.includes('cloudfront') ||
            sourceService?.id?.includes('elb') ||
            sourceService?.id?.includes('load-balancer')) {
          return {
            passed: false,
            warning: 'Database should not connect directly to edge services - use compute layer'
          };
        }
      }
    }

    return { passed: true };
  }

  checkCDNPlacement() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    const cdns = nodes.filter(n => {
      const service = this.getServiceDetails(n);
      return service?.id?.includes('cdn') ||
             service?.id?.includes('cloudfront');
    });

    for (const cdn of cdns) {
      const incomingEdges = edges.filter(e => e.target === cdn.id);

      if (incomingEdges.length > 0) {
        return {
          passed: false,
          warning: 'CDN should be at the edge, not behind other services'
        };
      }
    }

    return { passed: true };
  }

  checkLoadBalancerConnections() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    const loadBalancers = nodes.filter(n => {
      const service = this.getServiceDetails(n);
      return service?.id?.includes('elb') ||
             service?.id?.includes('load-balancer') ||
             service?.id?.includes('load-balancing');
    });

    for (const lb of loadBalancers) {
      const outgoing = edges.filter(e => e.source === lb.id);

      const connectsToCompute = outgoing.some(edge => {
        const target = nodes.find(n => n.id === edge.target);
        return this.getServiceCategory(target) === 'compute';
      });

      if (!connectsToCompute) {
        return {
          passed: false,
          warning: 'Load balancer should connect to compute services'
        };
      }
    }

    return { passed: true };
  }

  checkAPIGatewayUsage() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    const apiGateways = nodes.filter(n => {
      const service = this.getServiceDetails(n);
      return service?.id?.includes('api-gateway');
    });

    for (const api of apiGateways) {
      const outgoing = edges.filter(e => e.source === api.id);

      const hasLambda = outgoing.some(edge => {
        const target = nodes.find(n => n.id === edge.target);
        const service = this.getServiceDetails(target);
        return service?.id?.includes('lambda') ||
               service?.id?.includes('functions');
      });

      const hasEC2 = outgoing.some(edge => {
        const target = nodes.find(n => n.id === edge.target);
        const service = this.getServiceDetails(target);
        return service?.id?.includes('ec2') ||
               service?.id?.includes('vm-');
      });

      if (hasEC2 && !hasLambda) {
        return {
          passed: false,
          warning: 'API Gateway typically connects to Lambda. For EC2, use Application Load Balancer instead'
        };
      }
    }

    return { passed: true };
  }

  checkServerlessDatabaseChoice() {
    const nodes = this.submission.architecture.nodes;

    const hasLambda = nodes.some(n => {
      const service = this.getServiceDetails(n);
      return service?.category === 'serverless';
    });

    const hasRDS = nodes.some(n => {
      const service = this.getServiceDetails(n);
      return service?.id?.includes('rds') ||
             service?.id?.includes('sql-');
    });

    const hasDynamoDB = nodes.some(n => {
      const service = this.getServiceDetails(n);
      return service?.id?.includes('dynamodb') ||
             service?.id?.includes('cosmos') ||
             service?.id?.includes('firestore');
    });

    if (hasLambda && hasRDS && !hasDynamoDB) {
      return {
        passed: false,
        warning: 'Consider serverless database (DynamoDB/Firestore) for serverless architectures'
      };
    }

    return { passed: true };
  }

  checkHighTrafficCaching() {
    const nodes = this.submission.architecture.nodes;
    const requiresCaching = this.challenge.requirements?.some(req =>
      req.toLowerCase().includes('high-traffic') ||
      req.toLowerCase().includes('10,000') ||
      req.toLowerCase().includes('performance') ||
      req.toLowerCase().includes('fast')
    );

    if (!requiresCaching) {
      return { passed: true }; // Rule doesn't apply
    }

    const hasCache = nodes.some(n => {
      const service = this.getServiceDetails(n);
      return service?.category === 'cache' ||
             service?.id?.includes('cache') ||
             service?.id?.includes('cdn') ||
             service?.id?.includes('cloudfront');
    });

    if (!hasCache) {
      return {
        passed: false,
        warning: 'High-traffic applications should include caching for performance'
      };
    }

    return { passed: true };
  }

  checkRedundancyForHA() {
    const nodes = this.submission.architecture.nodes;
    const requiresHA = this.challenge.requirements?.some(req =>
      req.toLowerCase().includes('high availability') ||
      req.toLowerCase().includes('99.9%') ||
      req.toLowerCase().includes('fault-tolerant')
    );

    if (!requiresHA) {
      return { passed: true };
    }

    const computeCount = nodes.filter(n => {
      const service = this.getServiceDetails(n);
      return service?.category === 'compute';
    }).length;

    if (computeCount === 1) {
      return {
        passed: false,
        warning: 'High-availability requires multiple compute instances (redundancy)'
      };
    }

    return { passed: true };
  }

  checkChallengeSpecificPatterns() {
    const nodes = this.submission.architecture.nodes;
    const title = this.challenge.title.toLowerCase();

    // Static website shouldn't have compute/database
    if (title.includes('static website')) {
      const hasCompute = nodes.some(n =>
        this.getServiceCategory(n) === 'compute'
      );
      const hasDB = nodes.some(n =>
        this.getServiceCategory(n) === 'database'
      );

      if (hasCompute || hasDB) {
        return {
          passed: false,
          warning: "Static websites don't need compute or databases - over-engineered"
        };
      }
    }

    // Serverless challenge should use serverless
    if (title.includes('serverless')) {
      const hasServerless = nodes.some(n =>
        this.getServiceCategory(n) === 'serverless'
      );
      const hasEC2 = nodes.some(n => {
        const service = this.getServiceDetails(n);
        return service?.id?.includes('ec2');
      });

      if (!hasServerless && hasEC2) {
        return {
          passed: false,
          warning: 'Serverless challenge - consider Lambda/Functions instead of EC2/VMs'
        };
      }
    }

    return { passed: true };
  }

  checkExistingInfrastructureIntegration() {
    const nodes = this.submission.architecture.nodes;
    const edges = this.submission.architecture.edges;

    const existingNodes = nodes.filter(n => n.data?.isExisting);
    const newNodes = nodes.filter(n => !n.data?.isExisting);

    // No existing infrastructure = rule doesn't apply
    if (existingNodes.length === 0) {
      return { passed: true };
    }

    // Check if new nodes connect to existing infrastructure
    const hasIntegration = newNodes.some(newNode => {
      return edges.some(edge => {
        const connectsToExisting =
          (edge.source === newNode.id && existingNodes.some(e => e.id === edge.target)) ||
          (edge.target === newNode.id && existingNodes.some(e => e.id === edge.source));
        return connectsToExisting;
      });
    });

    if (!hasIntegration && newNodes.length > 0) {
      return {
        passed: false,
        warning: 'New services should integrate with existing infrastructure'
      };
    }

    return { passed: true };
  }

  evaluatePhase2() {
    const result = {
      phase: 2,
      warnings: [],
      rulesChecked: 0,
      rulesPassed: 0,
      timestamp: new Date()
    };

    // Define all rules
    const rules = [
      { name: 'Database Exposure', fn: this.checkDatabaseExposure.bind(this) },
      { name: 'CDN Placement', fn: this.checkCDNPlacement.bind(this) },
      { name: 'Load Balancer Connections', fn: this.checkLoadBalancerConnections.bind(this) },
      { name: 'API Gateway Usage', fn: this.checkAPIGatewayUsage.bind(this) },
      { name: 'Serverless Database Choice', fn: this.checkServerlessDatabaseChoice.bind(this) },
      { name: 'High Traffic Caching', fn: this.checkHighTrafficCaching.bind(this) },
      { name: 'Redundancy for HA', fn: this.checkRedundancyForHA.bind(this) },
      { name: 'Challenge-Specific Patterns', fn: this.checkChallengeSpecificPatterns.bind(this) },
      { name: 'Existing Infrastructure Integration', fn: this.checkExistingInfrastructureIntegration.bind(this) }
    ];

    // Run all rules (non-blocking)
    for (const rule of rules) {
      result.rulesChecked++;
      try {
        const ruleResult = rule.fn();

        if (ruleResult.passed) {
          result.rulesPassed++;
        } else if (ruleResult.warning) {
          result.warnings.push({
            rule: rule.name,
            message: ruleResult.warning
          });
        }
      } catch (error) {
        console.error(`Rule ${rule.name} failed:`, error);
      }
    }

    return result;
  }

  // Phase 3: LLM-Based Deep Evaluation
  async evaluatePhase3() {
    console.log('🤖 [Phase 3] Starting LLM-based evaluation...');

    const result = {
      phase: 3,
      usedLLM: false,
      llmFeedback: null,
      timestamp: new Date()
    };

    try {
      // Initialize LLM evaluator
      console.log(`🤖 [Phase 3] Using LLM provider: ${this.llmConfig.provider || 'anthropic'}`);
      const llmEvaluator = new LLMEvaluator(
        this.llmConfig.apiKey,
        this.llmConfig.provider || 'anthropic'
      );

      // Prepare architecture data for LLM
      const architectureData = {
        provider: this.submission.provider,
        nodes: this.submission.architecture.nodes,
        edges: this.submission.architecture.edges
      };

      // Call LLM evaluation
      const evaluation = await llmEvaluator.evaluateArchitecture(
        architectureData,
        this.challenge
      );

      result.usedLLM = evaluation.usedLLM;
      result.llmFeedback = evaluation.llmFeedback;
      result.overallScore = evaluation.overallScore;
      result.error = evaluation.error;

      console.log(`🤖 [Phase 3] Evaluation complete. Used LLM: ${evaluation.usedLLM}`);
      if (evaluation.llmFeedback) {
        console.log(`🤖 [Phase 3] LLM Feedback Summary: ${evaluation.llmFeedback.summary}`);
      }

    } catch (error) {
      console.error('❌ [Phase 3] LLM evaluation failed:', error);
      result.error = error.message;
    }

    return result;
  }

  calculateScoreWithPhases(phase1Result, phase2Result, phase3Result = null) {
    const { cost } = phase1Result;
    const { warnings } = phase2Result;
    const nodes = this.submission.architecture.nodes;

    // Base score calculation (existing)
    const costRatio = cost / this.challenge.constraints.maxCost;
    const optimalComplexity = this.challenge.optimalSolution?.complexity || nodes.length;
    const complexityRatio = nodes.length / (optimalComplexity * 2);

    let score = 1000 - (costRatio * 500) - (Math.min(complexityRatio, 1) * 300);

    // Bonuses (existing)
    if (costRatio < 0.5) {
      score += 100;
    }

    if (nodes.length <= optimalComplexity) {
      score += 50;
    }

    // Phase 2 penalties
    const warningPenalty = warnings.length * 25; // -25 points per warning
    score -= warningPenalty;

    // Phase 3: LLM score integration (if available)
    if (phase3Result && phase3Result.usedLLM && phase3Result.llmFeedback) {
      const llm = phase3Result.llmFeedback;

      // Calculate weighted LLM score (out of 200 points max)
      // functionalityScore (40%), scalabilityScore (25%),
      // costEfficiencyScore (20%), bestPracticesScore (15%)
      const llmScore = (
        (llm.functionalityScore || 0) * 0.40 +
        (llm.scalabilityScore || 0) * 0.25 +
        (llm.costEfficiencyScore || 0) * 0.20 +
        (llm.bestPracticesScore || 0) * 0.15
      ) * 20; // Scale to 200 points max (10 * 20 = 200)

      // Apply LLM score bonus/penalty (adjust base score by +/- up to 200 points)
      // A score of 7/10 should be neutral (0 adjustment)
      const llmAdjustment = (llmScore / 10 - 7) * 20; // -140 to +60 range
      score += llmAdjustment;

      // Additional penalty if doesn't meet requirements
      if (llm.meetsRequirements === false) {
        score -= 100;
      }
    }

    // Ensure score is not negative
    score = Math.max(0, Math.round(score));

    return score;
  }

  // Helper methods
  getServiceDetails(node) {
    if (!node) return null;

    const services = cloudServices[this.submission.provider];
    if (!services) return null;

    // Extract service ID from node ID
    const nodeId = node.id || '';
    const parts = nodeId.split('-');
    let serviceId = '';
    if (parts.length >= 3) {
      serviceId = parts.slice(1, -1).join('-');
    }

    // Search all categories
    for (const category in services) {
      const service = services[category].find(s => s.id === serviceId);
      if (service) return service;
    }

    return null;
  }

  getServiceCategory(node) {
    const service = this.getServiceDetails(node);
    return service?.category || null;
  }
}

module.exports = ArchitectureEvaluator;
