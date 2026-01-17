// LLM-based architecture evaluation using Claude or OpenAI
// This provides more intelligent evaluation of architecture correctness

class LLMEvaluator {
  constructor(apiKey, provider = 'anthropic') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async evaluateArchitecture(architecture, challenge) {
    const prompt = this.buildEvaluationPrompt(architecture, challenge);

    try {
      const response = await this.callLLM(prompt);
      return this.parseEvaluationResponse(response);
    } catch (error) {
      console.error('LLM evaluation failed:', error);
      return {
        usedLLM: false,
        llmFeedback: null,
        error: error.message
      };
    }
  }

  buildEvaluationPrompt(architecture, challenge) {
    return `You are a cloud architecture expert evaluating a solution to a challenge.

Challenge:
Title: ${challenge.title}
Difficulty: ${challenge.difficulty}
Description: ${challenge.description}

Requirements:
${challenge.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

Constraints:
- Max Cost: $${challenge.constraints.maxCost}/month
- Required Services: ${challenge.constraints.requiredServices.join(', ')}

User's Architecture:
Provider: ${architecture.provider}
Components: ${JSON.stringify(architecture.nodes.map(n => ({ type: n.type, label: n.data.label })), null, 2)}
Connections: ${JSON.stringify(architecture.edges.map(e => ({ from: e.source, to: e.target })), null, 2)}

Please evaluate this architecture and provide:
1. Does it meet the functional requirements? (Yes/No and why)
2. Are there any architectural flaws or security issues?
3. Suggestions for improvement
4. Rate the solution from 1-10 for:
   - Correctness
   - Scalability
   - Cost-efficiency
   - Best practices

Respond in JSON format:
{
  "meetsRequirements": boolean,
  "functionalityScore": number (1-10),
  "scalabilityScore": number (1-10),
  "costEfficiencyScore": number (1-10),
  "bestPracticesScore": number (1-10),
  "issues": [array of strings],
  "strengths": [array of strings],
  "suggestions": [array of strings],
  "summary": "brief summary"
}`;
  }

  async callLLM(prompt) {
    if (this.provider === 'anthropic') {
      return await this.callClaude(prompt);
    } else if (this.provider === 'openai') {
      return await this.callOpenAI(prompt);
    }
    throw new Error(`Unsupported LLM provider: ${this.provider}`);
  }

  async callClaude(prompt) {
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

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async callOpenAI(prompt) {
    // Using OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{
          role: 'user',
          content: prompt
        }],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  parseEvaluationResponse(response) {
    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      let jsonStr = response;
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const evaluation = JSON.parse(jsonStr);

      return {
        usedLLM: true,
        llmFeedback: evaluation,
        overallScore: Math.round(
          (evaluation.functionalityScore +
            evaluation.scalabilityScore +
            evaluation.costEfficiencyScore +
            evaluation.bestPracticesScore) / 4 * 10
        ) // Convert to 0-100 scale
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return {
        usedLLM: false,
        llmFeedback: null,
        error: 'Failed to parse LLM evaluation'
      };
    }
  }
}

module.exports = LLMEvaluator;
