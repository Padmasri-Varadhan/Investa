const KnowledgeBase = require('../models/KnowledgeBase');
const Holding = require('../models/Holding');
const Goal = require('../models/Goal');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const chatbotEngine = require('../services/chatbotEngine');

const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await ChatConversation.find({ userId }).sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await ChatMessage.find({ conversationId: id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;
        await ChatMessage.deleteMany({ conversationId: id });
        await ChatConversation.findByIdAndDelete(id);
        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting conversation' });
    }
};

const renameConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const conversation = await ChatConversation.findByIdAndUpdate(id, { title }, { new: true });
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Error renaming conversation' });
    }
};

const queryChatbot = async (req, res) => {
    try {
        const { message, lastTopic, history = [], conversationId } = req.body;
        const userId = req.user ? req.user._id : null;
        const input = message.toLowerCase().trim();

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Manage Conversation state
        let currentConversationId = conversationId;
        if (!currentConversationId) {
            const newConv = await ChatConversation.create({
                userId,
                title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
            });
            currentConversationId = newConv._id;
        } else {
            // Update timestamp
            await ChatConversation.findByIdAndUpdate(currentConversationId, { updatedAt: Date.now() });
        }

        // Save User Message
        await ChatMessage.create({
            conversationId: currentConversationId,
            role: 'user',
            text: message
        });

        let aiResponse = null;

        // --- 1. SMART INTENT DETECTION (PORTFOLIO) ---
        const portfolioKeywords = ['portfolio', 'holdings', 'my assets', 'my money', 'invested', 'how am i doing', 'balance'];
        if (portfolioKeywords.some(k => input.includes(k))) {
            const holdings = await Holding.find({ userId });
            if (holdings.length === 0) {
                aiResponse = { 
                    text: "### 📊 Your Portfolio Status\n\nIt looks like you haven't added any investments to your portfolio yet.\n\n**To get started:**\n1.  Go to the **Investment Ideas** page.\n2.  Explore assets that match your risk profile.\n3.  Start with a small SIP to build consistency.\n\nWould you like me to explain how a **SIP** works?",
                    topic: 'beginner',
                    complexity: 'beginner',
                    recommendedModule: 'Investment Ideas',
                    suggestedFollowUps: ['How does a SIP work?', 'What is risk profiling?'],
                    quickActions: [{ label: 'View Ideas', action: '/ideas' }]
                };
            } else {
                let totalValue = 0;
                holdings.forEach(h => totalValue += h.quantity * h.currentPrice);
                const topAsset = holdings.reduce((prev, current) => (prev.quantity * prev.currentPrice > current.quantity * current.currentPrice) ? prev : current);

                aiResponse = {
                    text: `### 📈 Portfolio Summary\n\nYour current portfolio is valued at **₹${totalValue.toLocaleString()}**.\n\n**Key Highlights:**\n*   **Total Assets**: You hold **${holdings.length}** different assets.\n*   **Largest Holding**: **${topAsset.name}** (${topAsset.symbol}), making up a significant portion of your wealth.\n\nWould you like to see a detailed breakdown of your **asset allocation** or recent **transactions**?`,
                    topic: 'portfolio',
                    complexity: 'intermediate',
                    recommendedModule: null,
                    suggestedFollowUps: ['Show asset allocation', 'How to rebalance portfolio?'],
                    quickActions: [{ label: 'Go to Dashboard', action: '/dashboard' }]
                };
            }
        }

        // --- 2. SMART INTENT DETECTION (GOALS) ---
        const goalKeywords = ['goal', 'my dreams', 'saving for', 'target', 'milestone', 'progress'];
        if (!aiResponse && goalKeywords.some(k => input.includes(k))) {
            const goals = await Goal.find({ userId });
            if (goals.length === 0) {
                aiResponse = { 
                    text: "### 🎯 Track Your Financial Goals\n\nYou haven't created any financial goals yet. Setting a goal is the first step toward successful investing!\n\n**Common goals include:**\n*   🚗 Buying a new car\n*   🏠 Down payment for a home\n*   🏖️ Retirement fund\n*   🎓 Children's education\n\nYou can add a goal in the **My Goals** section. Shall I show you how?",
                    topic: 'goals',
                    complexity: 'beginner',
                    recommendedModule: null,
                    suggestedFollowUps: ['How to set a financial goal?', 'What is the 50/30/20 rule?'],
                    quickActions: [{ label: 'Set a Goal', action: '/goals' }]
                };
            } else {
                const activeGoal = goals[0]; // Get the primary goal
                const progress = ((activeGoal.currentAmount / activeGoal.targetAmount) * 100).toFixed(1);
                aiResponse = {
                    text: `### 🎯 Goal Progress: ${activeGoal.title}\n\nYou are making steady progress toward your dream! \n\n**Status Update:**\n*   **Target Amount**: ₹${activeGoal.targetAmount.toLocaleString()}\n*   **Saved So Far**: ₹${activeGoal.currentAmount.toLocaleString()}\n*   **Completion**: **${progress}%**\n\nConsistent monthly contributions will help you reach this goal faster. Would you like some **risk management tips** to protect your savings?`,
                    topic: 'goals',
                    complexity: 'intermediate',
                    recommendedModule: null,
                    suggestedFollowUps: ['Risk management tips', 'How to increase SIP amount?'],
                    quickActions: [{ label: 'View Goals', action: '/goals' }]
                };
            }
        }

        // --- 3. CONTEXT-AWARE FOLLOW-UP ---
        const followUpKeywords = ['it safe', 'tell me more', 'elaborate', 'is it good', 'why', 'how', 'safe?', 'risk?'];
        if (!aiResponse && lastTopic && followUpKeywords.some(k => input.includes(k))) {
            const topicItem = await KnowledgeBase.findOne({ intent: lastTopic });
            if (topicItem) {
                let followUpText = `### 💡 More on ${topicItem.title}\n\n${topicItem.content}\n\n`;
                if (input.includes('safe') || input.includes('risk')) {
                    followUpText += `\n**Risk Note:** Regarding safety, every investment carries some level of risk. In the case of **${topicItem.title}**, the primary risk is market volatility. Diversification is the best way to stay safe!`;
                } else {
                    followUpText += `\nI hope this provides a clearer picture! Is there any other aspect of **${topicItem.title}** you'd like to explore?`;
                }
                aiResponse = { 
                    text: followUpText,
                    topic: lastTopic,
                    complexity: 'intermediate',
                    recommendedModule: 'Articles',
                    suggestedFollowUps: ['What is diversification?', 'How to measure risk?'],
                    quickActions: []
                };
            }
        }

        // --- 4. USE AI / HEURISTIC ENGINE ---
        if (!aiResponse) {
            aiResponse = await chatbotEngine.generateResponse(message, history);
        }

        // Save Bot Message
        await ChatMessage.create({
            conversationId: currentConversationId,
            role: 'bot',
            text: aiResponse.text,
            complexity: aiResponse.complexity,
            recommendedModule: aiResponse.recommendedModule,
            suggestedFollowUps: aiResponse.suggestedFollowUps,
            quickActions: aiResponse.quickActions
        });

        return res.json({
            ...aiResponse,
            conversationId: currentConversationId
        });

    } catch (error) {
        console.error('Chatbot Controller Error:', error);
        res.status(500).json({ 
            text: "I encountered a minor glitch while processing your request. Please try again!",
            topic: 'error',
            complexity: 'beginner',
            recommendedModule: null,
            suggestedFollowUps: [],
            quickActions: []
        });
    }
};

module.exports = { queryChatbot, getConversations, getMessages, deleteConversation, renameConversation };
