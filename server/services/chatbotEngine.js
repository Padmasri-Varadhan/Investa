const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// Load FAQ Dataset
const faqDatasetPath = path.join(__dirname, '../data/faqDataset.json');
let knowledgeBase = [];
if (fs.existsSync(faqDatasetPath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(faqDatasetPath, 'utf8'));
}

class ChatbotEngine {
    constructor() {
        if (process.env.GEMINI_API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            this.hasAI = true;
        } else {
            this.ai = null;
            this.hasAI = false;
        }
    }

    // A simple mock retrieval for fallback
    retrieveKnowledgeFallback(query) {
        const queryWords = query.toLowerCase().split(/\s+/);
        let bestMatch = null;
        let highestScore = 0;

        for (const item of knowledgeBase) {
            let score = 0;
            const itemWords = `${item.question} ${item.content} ${item.topic}`.toLowerCase().split(/\s+/);
            
            for (const qw of queryWords) {
                if (itemWords.includes(qw)) score++;
            }
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        }

        return highestScore >= 1 ? bestMatch.content : null;
    }

    async retrieveKnowledgeRAG(query) {
        if (!this.hasAI) return this.retrieveKnowledgeFallback(query);

        try {
            // Ideally we'd use vector embeddings, but given the small dataset, 
            // a fast LLM-based evaluation or our fallback logic works perfectly for this demonstration.
            // We'll use the fallback logic here for speed, but an embedding approach is supported architecturally.
            return this.retrieveKnowledgeFallback(query);
        } catch (e) {
            console.error("RAG error:", e);
            return null;
        }
    }

    async generateResponse(message, history = []) {
        const contextData = await this.retrieveKnowledgeRAG(message);
        
        if (this.hasAI) {
            try {
                return await this.generateWithAI(message, history, contextData);
            } catch (error) {
                console.error("AI Generation failed, falling back to smart mock:", error);
                return this.generateMockResponse(message, contextData, history);
            }
        }
        
        return this.generateMockResponse(message, contextData, history);
    }

    async generateWithAI(message, history, contextData) {
        // Format history for the prompt
        const historyText = history.slice(-5).map(msg => `${msg.role.toUpperCase()}: ${msg.text}`).join('\n');
        
        const systemPrompt = `
You are Investa AI, a smart and friendly financial learning assistant. Your role is to help users understand investments, stocks, mutual funds, real estate, personal finance, and wealth building in a simple and conversational way. You should sound natural, engaging, supportive, and intelligent. Start conversations warmly, maintain context, ask follow-up questions, and guide users toward relevant learning modules like Articles, Investment Ideas, and Video Advisory whenever useful. Your goal is to make financial learning easy and interactive.

Constraints:
1. Avoid generic AI phrases like "As an AI language model" or "I cannot provide financial advice". Instead, use natural alternatives. Use emojis moderately for friendliness.
2. Structure answers with Markdown (### headings, **bolding**, bullet points).
3. Keep the conversation flowing naturally and ask follow-up questions to keep the interaction engaging.
4. If unsure, say something natural like: "Could you explain that a little more? I want to make sure I guide you correctly."
5. Use the Context Info provided below if relevant.
6. Determine complexity (beginner, intermediate, advanced) based on query and history.
7. Return your response STRICTLY as a JSON object matching this exact schema:
{
  "text": "Markdown formatted response",
  "complexity": "beginner" | "intermediate" | "advanced",
  "recommendedModule": "Articles" | "Investment Ideas" | "Video Advisory" | null,
  "suggestedFollowUps": ["Question 1?", "Question 2?"],
  "quickActions": [{"label": "Action Name", "action": "URL/Route"}]
}

---
Chat History:
${historyText || "No previous history."}

Context Info from Knowledge Base:
${contextData || "No specific database context found."}
---

User query: "${message}"
`;

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const textResponse = response.text;
        
        try {
            return JSON.parse(textResponse);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", textResponse);
            return this.getFallbackPayload();
        }
    }

    generateMockResponse(message, contextData, history) {
        const lowerMessage = message.toLowerCase().trim();

        // 1. Handle Greetings
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'how are you'];
        if (greetings.some(g => lowerMessage.startsWith(g) || lowerMessage === g)) {
            return {
                text: "Hello! Welcome to Investa 👋 How can I help you with your investment journey today? \n\nAre you looking to learn about the basics, or do you want to dive straight into investment ideas?",
                topic: 'greeting',
                complexity: 'beginner',
                recommendedModule: null,
                suggestedFollowUps: ['I want to start investing.', 'What are the safest investments?'],
                quickActions: []
            };
        }

        // 2. Handle Starting Investing
        if (lowerMessage.includes('start investing') || lowerMessage.includes('beginner')) {
            return {
                text: "That's a great step toward financial growth! 🚀 \n\nTo get started, what are your primary goals right now? \n*   Safe investments\n*   Long-term wealth creation\n*   Passive income\n*   Stock market learning\n\nLet me know what interests you most, and we'll take it from there!",
                topic: 'getting-started',
                complexity: 'beginner',
                recommendedModule: 'Articles',
                suggestedFollowUps: ['Safe investments', 'Long-term wealth creation'],
                quickActions: [{ label: 'Read Beginner Guide', action: '/articles' }]
            };
        }

        // If we found a RAG context
        if (contextData) {
            const complexityMatch = knowledgeBase.find(k => k.content === contextData);
            return {
                text: `### 💡 Let's Break That Down:\n\n${contextData}\n\nDoes this make sense, or would you like me to explain any part of it further?`,
                topic: complexityMatch ? complexityMatch.topic : 'General',
                complexity: complexityMatch ? complexityMatch.complexity : 'intermediate',
                recommendedModule: 'Articles',
                suggestedFollowUps: ['Tell me more', 'What are the risks?'],
                quickActions: [{ label: 'Read Related Articles', action: '/articles' }]
            };
        }

        // If no context is found, use the conversational fallback
        return this.getFallbackPayload();
    }

    getFallbackPayload() {
        return {
            text: "Could you explain that a little more? 🤔 \n\nI want to make sure I guide you correctly. Are you asking about stocks, mutual funds, or another investment type?",
            topic: 'unknown',
            complexity: 'beginner',
            recommendedModule: null,
            suggestedFollowUps: ['Tell me about Stocks', 'Explain Mutual Funds', 'Best SIPs to start'],
            quickActions: []
        };
    }
}

module.exports = new ChatbotEngine();
