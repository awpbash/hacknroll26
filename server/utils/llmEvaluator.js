// LLM-based architecture evaluation using Claude or OpenAI
// This provides more intelligent evaluation of architecture correctness

class LLMEvaluator {
  constructor(apiKey, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    console.log(`🔧 [LLMEvaluator] Initialized with provider: ${provider}`);
    console.log(`🔧 [LLMEvaluator] API Key present: ${!!apiKey}, Length: ${apiKey?.length || 0}`);
  }

  async evaluateArchitecture(architecture, challenge) {
    console.log(`\n🚀 [LLMEvaluator] Starting evaluation for challenge: ${challenge.title}`);
    console.log(`🚀 [LLMEvaluator] Architecture has ${architecture.nodes?.length || 0} nodes, ${architecture.edges?.length || 0} edges`);
    console.log(`🚀 [LLMEvaluator] Provider: ${architecture.provider}`);

    const prompt = this.buildEvaluationPrompt(architecture, challenge);
    console.log(`📝 [LLMEvaluator] Prompt built, length: ${prompt.length} characters`);

    try {
      const response = await this.callLLM(prompt);
      console.log(`✅ [LLMEvaluator] LLM response received, length: ${response.length} characters`);
      const parsed = this.parseEvaluationResponse(response);
      console.log(`✅ [LLMEvaluator] Response parsed successfully, usedLLM: ${parsed.usedLLM}`);
      return parsed;
    } catch (error) {
      console.error('❌ [LLMEvaluator] Evaluation failed:', error.message);
      console.error('❌ [LLMEvaluator] Stack:', error.stack);
      return {
        usedLLM: false,
        llmFeedback: null,
        error: error.message
      };
    }
  }

  buildEvaluationPrompt(architecture, challenge) {
  // Use calculated monthly cost from Phase 1 (passed from evaluator)
  const totalCost = architecture.calculatedCost || 0;

  // Extract service types used
  const servicesUsed = architecture.nodes.map(n => ({
    name: n.data.serviceName || n.data.customLabel || 'Unknown Service',  // Fixed: use serviceName
    type: n.id.split('-').slice(1, -1).join('-'),  // Extract service ID from node ID (e.g., "aws-cloudfront-123" -> "cloudfront")
    category: n.data.category,
    cost: n.data.cost || 0  // Base cost per unit (shown for reference)
  }));

  // Build connection map
  const connectionMap = architecture.edges.map(e => {
    const source = architecture.nodes.find(n => n.id === e.source);
    const target = architecture.nodes.find(n => n.id === e.target);
    return {
      from: source?.data?.serviceName || source?.data?.customLabel || e.source,  // Fixed: use serviceName
      to: target?.data?.serviceName || target?.data?.customLabel || e.target,    // Fixed: use serviceName
      fromType: source?.id.split('-').slice(1, -1).join('-'),  // Extract service type from ID
      toType: target?.id.split('-').slice(1, -1).join('-')     // Extract service type from ID
    };
  });

  const examples = this.getScoringExamples(challenge)

  return `You are a senior cloud architect evaluating a student's solution. Use the detailed rubrics below to score objectively.

═══════════════════════════════════════════════════════
CHALLENGE DETAILS
═══════════════════════════════════════════════════════

Title: ${challenge.title}
Difficulty: ${challenge.difficulty}
Description: ${challenge.description}

REQUIREMENTS (must satisfy ALL):
${challenge.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

CONSTRAINTS:
- Maximum Budget: $${challenge.constraints.maxCost}/month
- Required Service Categories: ${challenge.constraints.requiredServices.join(', ')}
- Service Count Range: ${challenge.constraints.minServices}-${challenge.constraints.maxServices} components

═══════════════════════════════════════════════════════
STUDENT'S ARCHITECTURE
═══════════════════════════════════════════════════════

Provider: ${architecture.provider}
Total Cost: $${totalCost.toFixed(2)}/month
Component Count: ${architecture.nodes.length}

SERVICES USED:
${servicesUsed.map(s => `  • ${s.name} (${s.category}) - $${s.cost}/month`).join('\n')}

CONNECTIONS:
${connectionMap.map(c => `  • ${c.from} → ${c.to}`).join('\n')}

═══════════════════════════════════════════════════════
EVALUATION RUBRICS (Score each dimension 1-10)
═══════════════════════════════════════════════════════

1️⃣ FUNCTIONALITY SCORE (1-10)
Evaluates: Does the architecture meet all stated requirements?

Scoring Guide:
10 = Perfectly meets ALL requirements with complete implementation
9  = Meets all requirements with minor gaps in implementation details
8  = Meets all critical requirements, minor requirement partially addressed
7  = Meets most requirements, one minor requirement missing
6  = Meets core requirements, multiple minor gaps
5  = Meets basic requirements, significant gaps in completeness
4  = Partially meets requirements, missing key functionality
3  = Addresses some requirements, major functionality missing
2  = Minimal functionality, most requirements not met
1  = Does not meet requirements, fundamentally wrong approach

Check EACH requirement explicitly:
${challenge.requirements.map((req, i) => `  ${i + 1}. "${req}" - Does architecture address this? How?`).join('\n')}

Your score: ___/10
Justification: Explain which requirements are met/missing


2️⃣ SCALABILITY SCORE (1-10)
Evaluates: Can this architecture handle growth and increased load?

Scoring Guide:
10 = Auto-scales seamlessly, no bottlenecks, multi-region ready
9  = Excellent auto-scaling, minor potential bottlenecks
8  = Good scaling mechanisms, managed services used appropriately
7  = Can scale with some manual intervention required
6  = Limited scaling, some components will become bottlenecks
5  = Minimal scalability, significant manual scaling needed
4  = Poor scalability, single points of failure
3  = Severely limited scalability, major bottlenecks
2  = Cannot handle growth, fundamentally unscalable design
1  = No consideration for scale, will fail under load

Check for:
  □ Are compute resources auto-scalable? (Lambda, Auto Scaling Groups)
  □ Are there single points of failure?
  □ Is database choice appropriate for scale? (DynamoDB vs RDS)
  □ Is there load balancing for traffic distribution?
  □ Are stateless services used where appropriate?

Your score: ___/10
Justification: Identify scaling strengths and bottlenecks


3️⃣ COST EFFICIENCY SCORE (1-10)
Evaluates: Is this the most cost-effective way to meet requirements?

Scoring Guide:
10 = Optimal cost, uses most economical services for requirements
9  = Excellent cost optimization, minimal waste
8  = Good cost choices, minor optimizations possible
7  = Reasonable costs, some over-provisioning
6  = Acceptable costs, noticeable inefficiencies
5  = Moderate waste, several cheaper alternatives exist
4  = Poor cost choices, significant over-provisioning
3  = Very expensive, major cost optimization needed
2  = Extremely wasteful, wrong service choices
1  = Unnecessarily expensive, completely wrong approach

Check for:
  □ Actual cost vs budget: $${totalCost.toFixed(2)} / $${challenge.constraints.maxCost}
  □ Are serverless options used for variable workloads?
  □ Are there cheaper alternatives? (Lambda vs EC2, DynamoDB vs RDS)
  □ Is there over-provisioning? (m5.large when t3.micro would work)
  □ Are there unnecessary services adding cost?

Cost Ratio: ${((totalCost / challenge.constraints.maxCost) * 100).toFixed(0)}% of budget
- <30% = Excellent (9-10)
- 30-50% = Very good (8-9)
- 50-70% = Good (7-8)
- 70-85% = Acceptable (5-7)
- 85-95% = High (3-5)
- >95% = Too expensive (1-3)

Your score: ___/10
Justification: Explain cost efficiency or waste


4️⃣ BEST PRACTICES SCORE (1-10)
Evaluates: Does this follow cloud architecture best practices?

Scoring Guide:
10 = Exemplary architecture, textbook implementation
9  = Excellent practices, very minor improvements possible
8  = Strong architecture, follows most best practices
7  = Good architecture, some best practices missed
6  = Adequate architecture, several practices not followed
5  = Mediocre architecture, important practices missing
4  = Poor architecture, many anti-patterns present
3  = Bad architecture, serious design flaws
2  = Very poor architecture, fundamental mistakes
1  = Completely wrong, violates basic principles

Check for:
  □ Security: Is database publicly exposed? Are resources in appropriate layers?
  □ Network topology: Is CDN at edge? Load balancer before compute?
  □ Service composition: Appropriate service choices? (API Gateway + Lambda, not API Gateway + EC2)
  □ Redundancy: Multiple instances/availability zones for critical components?
  □ Caching: Is caching used appropriately for performance?
  □ Separation of concerns: Clear layers (presentation, compute, data)?
  □ Managed services: Using managed services vs self-managed?

Common ANTI-PATTERNS to penalize:
  ❌ Database directly exposed to internet (-2 points)
  ❌ CDN behind load balancer instead of at edge (-1 point)
  ❌ API Gateway connecting to EC2 instead of Lambda (-1 point)
  ❌ S3 directly connecting to database (-1 point)
  ❌ No caching for high-traffic applications (-1 point)
  ❌ Single point of failure in production system (-2 points)
  ❌ RDS with Lambda for serverless (connection pooling issues) (-1 point)

Your score: ___/10
Justification: List practices followed and violations


═══════════════════════════════════════════════════════
CHALLENGE-SPECIFIC EVALUATION
═══════════════════════════════════════════════════════

${this.getChallengeSpecificGuidance(challenge.id)}

═══════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no preamble):

{
  "meetsRequirements": boolean,
  "functionalityScore": number (1-10, based on rubric above),
  "scalabilityScore": number (1-10, based on rubric above),
  "costEfficiencyScore": number (1-10, based on rubric above),
  "bestPracticesScore": number (1-10, based on rubric above),
  "issues": [
    "Specific architectural problem 1",
    "Specific architectural problem 2"
  ],
  "strengths": [
    "Specific good decision 1",
    "Specific good decision 2"
  ],
  "suggestions": [
    "Specific actionable improvement 1",
    "Specific actionable improvement 2"
  ],
  "requirementAnalysis": [
    {
      "requirement": "requirement text",
      "satisfied": boolean,
      "explanation": "how it's met or why it's not"
    }
  ],
  "costAnalysis": {
    "total": ${totalCost.toFixed(2)},
    "percentageOfBudget": ${((totalCost / challenge.constraints.maxCost) * 100).toFixed(0)},
    "wastefulness": "low | moderate | high",
    "optimizationOpportunities": ["specific suggestion 1", "specific suggestion 2"]
  },
  "summary": "2-3 sentence overall assessment"
}

CRITICAL INSTRUCTIONS:
- Be objective and use the rubrics strictly
- Scores must reflect the scoring guides exactly
- Provide specific, actionable feedback (not generic advice)
- Identify actual components by name from the architecture
- Every score must have clear justification based on rubric criteria
- If multiple anti-patterns exist, deduct points accordingly from bestPracticesScore

═══════════════════════════════════════════════════════
SCORING CALIBRATION EXAMPLES
═══════════════════════════════════════════════════════

${examples}

Use these examples to calibrate your scoring. The student's solution should be scored relative to these benchmarks.
`;



}

getChallengeSpecificGuidance(challengeId) {
  const guidance = {
    'static-website': `
EXPECTED PATTERN for Static Website:
Minimal: S3 only (serves files, cheapest)
Optimal: CloudFront (CDN) → S3 (fast global delivery)

RED FLAGS:
- Using compute (EC2/Lambda) - UNNECESSARY, expensive
- Using database - UNNECESSARY, wrong pattern
- Using load balancer - UNNECESSARY, overkill
- Cost >$10/month - too expensive for static site

SCORING ADJUSTMENTS:
- Has EC2 or Lambda: functionalityScore max 5 (over-engineering)
- Has database: functionalityScore max 5 (wrong approach)
- No CDN but within budget: functionalityScore 7-8 (works but not optimal)
- CDN + S3: functionalityScore 9-10 (perfect)`,

    'serverless-api': `
EXPECTED PATTERN for Serverless REST API:
API Gateway → Lambda → DynamoDB (or RDS if SQL needed)

ACCEPTABLE ALTERNATIVES:
- API Gateway → Lambda → RDS (valid if SQL requirements)
- ALB → Lambda → DynamoDB (less common but valid)

RED FLAGS:
- Using EC2 instead of Lambda - NOT serverless
- Using only compute without API Gateway - incomplete
- No database - cannot persist data
- Cost >$25/month - likely over-provisioned

SCORING ADJUSTMENTS:
- Has EC2 instead of Lambda: functionalityScore max 6 (not serverless)
- Missing API Gateway: functionalityScore max 7 (incomplete)
- RDS with Lambda but low traffic: costEfficiencyScore max 7 (DynamoDB cheaper)
- Perfect serverless pattern: functionalityScore 9-10`,

    'high-traffic-webapp': `
EXPECTED PATTERN for High-Traffic Web App:
CloudFront → ALB → EC2 Auto Scaling → ElastiCache → RDS Multi-AZ

MINIMUM REQUIREMENTS:
- Load balancer (distribute traffic)
- Multiple compute instances OR auto-scaling (no single point of failure)
- Database (store data)
- Caching (performance at scale)

RED FLAGS:
- Single EC2 instance - CRITICAL: single point of failure
- No load balancer with multiple instances - traffic not distributed
- No caching - poor performance at scale
- No CDN - slow for global users
- Cost <$100/month - likely under-provisioned for 100K users
- Cost >$180/month - over budget

SCORING ADJUSTMENTS:
- Single compute instance: scalabilityScore max 3, bestPracticesScore max 4
- No caching: scalabilityScore max 6, bestPracticesScore -1
- No CDN: scalabilityScore max 7
- Has all components (LB, auto-scaling, cache, CDN): functionalityScore 9-10`
  };

  return guidance[challengeId] || `
GENERAL PATTERN EVALUATION:
- Verify all required service categories are present
- Check for appropriate service choices for the use case
- Ensure architecture can meet stated requirements
- Look for common anti-patterns and security issues`;
}

// Add this to your evaluator class to show Claude examples
getScoringExamples(challenge) {
  const examples = {
    'static-website': `
SCORING EXAMPLES for Static Website Challenge:

Example A: S3 + CloudFront
Services: S3 ($2.30/mo), CloudFront ($8.50/mo)
Cost: $10.80/mo (72% of budget)
- functionalityScore: 10 (perfect solution)
- scalabilityScore: 10 (CDN scales automatically)
- costEfficiencyScore: 9 (optimal for requirements)
- bestPracticesScore: 10 (textbook implementation)

Example B: S3 only
Services: S3 ($2.30/mo)
Cost: $2.30/mo (15% of budget)
- functionalityScore: 8 (works but not optimal)
- scalabilityScore: 7 (S3 scales, but no edge caching)
- costEfficiencyScore: 10 (very cheap)
- bestPracticesScore: 7 (acceptable but missing CDN)

Example C: EC2 + RDS
Services: EC2 ($7.59/mo), RDS ($12.41/mo)
Cost: $20/mo (133% over budget)
- functionalityScore: 3 (over-engineered, wrong approach)
- scalabilityScore: 4 (won't scale well, single instance)
- costEfficiencyScore: 2 (way too expensive)
- bestPracticesScore: 3 (completely wrong pattern)`,

    'serverless-api': `
SCORING EXAMPLES for Serverless REST API Challenge:

Example A: API Gateway + Lambda + DynamoDB
Services: API Gateway ($3.50/mo), Lambda ($0.20/mo), DynamoDB ($1.25/mo)
Cost: $4.95/mo (16% of budget)
- functionalityScore: 10 (perfect serverless pattern)
- scalabilityScore: 10 (auto-scales to zero)
- costEfficiencyScore: 10 (extremely cost-effective)
- bestPracticesScore: 10 (best practice for serverless)

Example B: API Gateway + Lambda + RDS
Services: API Gateway ($3.50/mo), Lambda ($0.20/mo), RDS ($12.41/mo)
Cost: $16.11/mo (54% of budget)
- functionalityScore: 9 (works, valid if SQL needed)
- scalabilityScore: 8 (Lambda scales, RDS is bottleneck)
- costEfficiencyScore: 7 (more expensive than needed)
- bestPracticesScore: 7 (RDS+Lambda has connection issues)

Example C: ALB + EC2 + RDS
Services: ALB ($22.50/mo), EC2 ($7.59/mo), RDS ($12.41/mo)
Cost: $42.50/mo (142% over budget)
- functionalityScore: 5 (works but NOT serverless)
- scalabilityScore: 5 (can scale but not automatically)
- costEfficiencyScore: 3 (way over budget)
- bestPracticesScore: 6 (traditional pattern, not serverless)`,

    'high-traffic-webapp': `
SCORING EXAMPLES for High-Traffic Web Application Challenge:

Example A: Full Stack (CloudFront, ALB, EC2 Auto Scaling, ElastiCache, RDS)
Services: CloudFront ($8.50), ALB ($22.50), EC2×2 ($15.18), ElastiCache ($13.14), RDS Multi-AZ ($24.82)
Cost: $84.14/mo (42% of budget)
- functionalityScore: 10 (all requirements met)
- scalabilityScore: 10 (auto-scales, redundant)
- costEfficiencyScore: 9 (efficient for scale)
- bestPracticesScore: 10 (perfect architecture)

Example B: Missing Cache (CloudFront, ALB, EC2×2, RDS)
Services: CloudFront ($8.50), ALB ($22.50), EC2×2 ($15.18), RDS ($24.82)
Cost: $71/mo (36% of budget)
- functionalityScore: 8 (works but performance issues)
- scalabilityScore: 7 (database will bottleneck)
- costEfficiencyScore: 9 (good cost)
- bestPracticesScore: 7 (missing caching layer)

Example C: Single Instance (ALB, EC2, RDS)
Services: ALB ($22.50), EC2 ($7.59), RDS ($12.41)
Cost: $42.50/mo (21% of budget)
- functionalityScore: 4 (single point of failure)
- scalabilityScore: 3 (cannot handle 100K users)
- costEfficiencyScore: 8 (cheap but inadequate)
- bestPracticesScore: 3 (violates redundancy principles)`
  };

  return examples[challenge.id] || '';
}

  async callLLM(prompt) {
    console.log(`🌐 [LLMEvaluator] Calling LLM with provider: ${this.provider}`);

    if (this.provider === 'anthropic') {
      console.log(`🌐 [LLMEvaluator] Using Anthropic Claude API`);
      return await this.callClaude(prompt);
    } else if (this.provider === 'openai') {
      console.log(`🌐 [LLMEvaluator] Using OpenAI API`);
      return await this.callOpenAI(prompt);
    }
    throw new Error(`Unsupported LLM provider: ${this.provider}`);
  }

  async callClaude(prompt) {
    console.log(`📞 [Anthropic] Calling Claude API with model: claude-3-5-sonnet-20241022`);

    // Using Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    console.log(`📞 [Anthropic] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Anthropic] API error: ${response.statusText}`, errorText);
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ [Anthropic] Success! Response length: ${data.content[0].text.length}`);
    return data.content[0].text;
  }

  async callOpenAI(prompt) {
    const model = 'gpt-4o';  // Using GPT-4o
    console.log(`📞 [OpenAI] Calling OpenAI API with model: ${model}`);
    console.log(`📞 [OpenAI] API Key (first 10 chars): ${this.apiKey.substring(0, 10)}...`);

    const requestBody = {
      model: model,
      messages: [{
        role: 'user',
        content: prompt
      }],
      response_format: { type: 'json_object' }
    };

    console.log(`📞 [OpenAI] Request body prepared, sending to API...`);

    // Using OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`📞 [OpenAI] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [OpenAI] API error response:`, errorText);
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ [OpenAI] Success! Response received`);
    console.log(`✅ [OpenAI] Tokens used - Prompt: ${data.usage?.prompt_tokens}, Completion: ${data.usage?.completion_tokens}`);
    console.log(`✅ [OpenAI] Content length: ${data.choices[0].message.content.length}`);

    return data.choices[0].message.content;
  }

  parseEvaluationResponse(response) {
    console.log(`🔍 [Parser] Parsing LLM response...`);

    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      let jsonStr = response;
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        console.log(`🔍 [Parser] Found JSON in markdown code block`);
        jsonStr = jsonMatch[1];
      } else {
        console.log(`🔍 [Parser] Using raw response as JSON`);
      }

      const evaluation = JSON.parse(jsonStr);
      console.log(`✅ [Parser] JSON parsed successfully`);
      console.log(`📊 [Parser] Scores - Functionality: ${evaluation.functionalityScore}, Scalability: ${evaluation.scalabilityScore}, Cost: ${evaluation.costEfficiencyScore}, Best Practices: ${evaluation.bestPracticesScore}`);
      console.log(`📊 [Parser] Meets requirements: ${evaluation.meetsRequirements}`);
      console.log(`📊 [Parser] Issues found: ${evaluation.issues?.length || 0}`);
      console.log(`📊 [Parser] Strengths found: ${evaluation.strengths?.length || 0}`);

      const overallScore = Math.round(
        (evaluation.functionalityScore +
          evaluation.scalabilityScore +
          evaluation.costEfficiencyScore +
          evaluation.bestPracticesScore) / 4 * 10
      ); // Convert to 0-100 scale

      console.log(`📊 [Parser] Overall score calculated: ${overallScore}/100`);

      return {
        usedLLM: true,
        llmFeedback: evaluation,
        overallScore: overallScore
      };
    } catch (error) {
      console.error('❌ [Parser] Failed to parse LLM response:', error.message);
      console.error('❌ [Parser] Response preview:', response.substring(0, 200));
      return {
        usedLLM: false,
        llmFeedback: null,
        error: 'Failed to parse LLM evaluation'
      };
    }
  }
}

module.exports = LLMEvaluator;
