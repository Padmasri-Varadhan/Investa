const KnowledgeBase = require('../models/KnowledgeBase');
const Holding = require('../models/Holding');
const Goal = require('../models/Goal');

/**
 * @desc    Get dynamic chatbot response with smart intent detection
 * @route   POST /api/chatbot/query
 * @access  Private (for portfolio) / Public (for general KB)
 */
const queryChatbot = async (req, res) => {
    try {
        const { message, lastTopic } = req.body;
        const userId = req.user ? req.user._id : null;
        const input = message.toLowerCase().trim();

        // --- 1. SMART INTENT DETECTION (PORTFOLIO) ---
        const portfolioKeywords = ['portfolio', 'holdings', 'my assets', 'my money', 'invested', 'how am i doing', 'balance'];
        if (userId && portfolioKeywords.some(k => input.includes(k))) {
            const holdings = await Holding.find({ userId });
            
            if (holdings.length === 0) {
                return res.json({ 
                    text: "### 📊 Your Portfolio Status\n\nIt looks like you haven't added any investments to your portfolio yet.\n\n**To get started:**\n1.  Go to the **Investment Ideas** page.\n2.  Explore assets that match your risk profile.\n3.  Start with a small SIP to build consistency.\n\nWould you like me to explain how a **SIP** works?",
                    topic: 'beginner'
                });
            }
            
            let totalValue = 0;
            holdings.forEach(h => totalValue += h.quantity * h.currentPrice);
            
            const topAsset = holdings.reduce((prev, current) => (prev.quantity * prev.currentPrice > current.quantity * current.currentPrice) ? prev : current);

            return res.json({
                text: `### 📈 Portfolio Summary\n\nYour current portfolio is valued at **₹${totalValue.toLocaleString()}**.\n\n**Key Highlights:**\n*   **Total Assets**: You hold **${holdings.length}** different assets.\n*   **Largest Holding**: **${topAsset.name}** (${topAsset.symbol}), making up a significant portion of your wealth.\n\nWould you like to see a detailed breakdown of your **asset allocation** or recent **transactions**?`,
                topic: 'portfolio'
            });
        }

        // --- 2. SMART INTENT DETECTION (GOALS) ---
        const goalKeywords = ['goal', 'my dreams', 'saving for', 'target', 'milestone', 'progress'];
        if (userId && goalKeywords.some(k => input.includes(k))) {
            const goals = await Goal.find({ userId });
            
            if (goals.length === 0) {
                return res.json({ 
                    text: "### 🎯 Track Your Financial Goals\n\nYou haven't created any financial goals yet. Setting a goal is the first step toward successful investing!\n\n**Common goals include:**\n*   🚗 Buying a new car\n*   🏠 Down payment for a home\n*   🏖️ Retirement fund\n*   🎓 Children's education\n\nYou can add a goal in the **My Goals** section. Shall I show you how?",
                    topic: 'goals'
                });
            }

            const activeGoal = goals[0]; // Get the primary goal
            const progress = ((activeGoal.currentAmount / activeGoal.targetAmount) * 100).toFixed(1);
            
            return res.json({
                text: `### 🎯 Goal Progress: ${activeGoal.title}\n\nYou are making steady progress toward your dream! \n\n**Status Update:**\n*   **Target Amount**: ₹${activeGoal.targetAmount.toLocaleString()}\n*   **Saved So Far**: ₹${activeGoal.currentAmount.toLocaleString()}\n*   **Completion**: **${progress}%**\n\nConsistent monthly contributions will help you reach this goal faster. Would you like some **risk management tips** to protect your savings?`,
                topic: 'goals'
            });
        }

        // --- 3. CONTEXT-AWARE FOLLOW-UP (SMART DETECT "IT", "MORE", "SAFE") ---
        const followUpKeywords = ['it safe', 'tell me more', 'elaborate', 'is it good', 'why', 'how', 'safe?', 'risk?'];
        if (lastTopic && followUpKeywords.some(k => input.includes(k))) {
            const topicItem = await KnowledgeBase.findOne({ intent: lastTopic });
            if (topicItem) {
                // Return a more detailed follow-up based on context
                let followUpText = `### 💡 More on ${topicItem.title}\n\n${topicItem.content}\n\n`;
                
                if (input.includes('safe') || input.includes('risk')) {
                    followUpText += `\n**Risk Note:** Regarding safety, every investment carries some level of risk. In the case of **${topicItem.title}**, the primary risk is market volatility. Diversification is the best way to stay safe!`;
                } else {
                    followUpText += `\nI hope this provides a clearer picture! Is there any other aspect of **${topicItem.title}** you'd like to explore?`;
                }

                return res.json({ 
                    text: followUpText,
                    topic: lastTopic
                });
            }
        }

        // --- 4. KNOWLEDGE BASE SEARCH (FINANCE + WEBSITE) ---
        const kbItems = await KnowledgeBase.find({});
        for (const item of kbItems) {
            if (item.keywords.some(k => input.includes(k.toLowerCase()))) {
                return res.json({ 
                    text: item.content, 
                    topic: item.intent 
                });
            }
        }

        // --- 5. SMART FALLBACK ---
        res.json({
            text: "### 👋 I'm here to help!\n\nI didn't quite catch that. To give you the most accurate answer, could you please rephrase your question? \n\n**You can ask me things like:**\n*   \"Explain how **SIP** works.\"\n*   \"What is an **ETF**?\"\n*   \"How do I use the **Guided Journey**?\"\n*   \"Show me my **portfolio progress**.\"\n\nWhat would you like to explore first?",
            topic: null
        });

    } catch (error) {
        console.error('Chatbot Controller Error:', error);
        res.status(500).json({ message: "I encountered a minor glitch while processing your request. Please try again!" });
    }
};

module.exports = { queryChatbot };
