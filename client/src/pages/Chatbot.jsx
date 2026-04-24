import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, CardContent, Typography, TextField, IconButton,
    Avatar, CircularProgress, Chip, Paper, Button
} from '@mui/material';
import { Send, SmartToy, Person, Refresh } from '@mui/icons-material';

/**
 * AI Chatbot Page
 * Investment Q&A chatbot with pre-programmed responses
 */

const botResponses = {
    // Greetings
    'hello': "Hello! 👋 I'm Investa AI, your personal investment assistant. Ask me anything about investing, stocks, ETFs, or financial planning!",
    'hi': "Hi there! 👋 Ready to help with all your investment questions. What would you like to know?",
    'hey': "Hey! 😊 I'm here to help you on your investment journey. What's on your mind?",

    // Basic investment questions
    'stock': "📊 **Stocks** represent ownership shares in a company. When you buy stock, you become a partial owner and can benefit from the company's growth through price appreciation and dividends.\n\n**Tips for stock investing:**\n• Diversify across sectors\n• Research before you buy\n• Think long-term\n• Don't invest money you can't afford to lose",

    'etf': "🔗 **ETFs (Exchange-Traded Funds)** are baskets of securities that trade on stock exchanges like individual stocks.\n\n**Why ETFs are great:**\n• Instant diversification\n• Low expense ratios\n• Tax efficient\n• Easy to buy and sell\n\nPopular ETFs: SPY (S&P 500), QQQ (NASDAQ), VTI (Total Market)",

    'sip': "💰 **SIP (Systematic Investment Plan)** is investing a fixed amount regularly in mutual funds.\n\n**Benefits of SIP:**\n• Rupee cost averaging\n• Discipline in investing\n• Power of compounding\n• Start with as low as ₹500/month\n\nExpert tip: Start early and stay consistent!",

    'mutual fund': "📈 **Mutual Funds** pool money from many investors to buy a diversified portfolio of stocks, bonds, or other securities.\n\n**Types:**\n• Equity Funds (higher risk, higher return)\n• Debt Funds (lower risk, steady returns)\n• Hybrid Funds (balanced approach)\n\nChoose based on your risk tolerance and investment horizon.",

    'crypto': "₿ **Cryptocurrency** is a high-risk, high-reward asset class.\n\n**Key facts:**\n• Extremely volatile - prices can swing 50%+ in days\n• Bitcoin and Ethereum are most established\n• Only invest what you can afford to lose\n• Recommended allocation: max 5-10% of portfolio\n\n⚠️ Always do your own research (DYOR)!",

    'index fund': "📊 **Index Funds** track a market index like S&P 500 or NIFTY 50.\n\n**Why experts love them:**\n• 80%+ of active funds underperform index funds long-term\n• Very low fees (0.03-0.2% vs 1-2% for active funds)\n• Automatic diversification\n• Perfect for passive investors\n\nWarren Buffett famously recommends index funds for most investors!",

    'portfolio': "🎯 A well-balanced **portfolio** typically includes:\n\n| Asset | Beginner | Intermediate | Advanced |\n|-------|----------|--------------|----------|\n| Stocks/Equity | 40% | 60% | 70% |\n| Bonds | 40% | 20% | 10% |\n| ETFs | 10% | 15% | 10% |\n| Crypto | 0% | 5% | 10% |\n\nAdjust based on your age, risk tolerance, and goals!",

    'risk': "⚖️ **Investment Risk** is the uncertainty of returns.\n\n**Risk Levels:**\n• 🟢 Low Risk: Government bonds, Fixed deposits, Gold\n• 🟡 Medium Risk: Index funds, Blue-chip stocks, REITs\n• 🔴 High Risk: Individual stocks, Crypto, Small-cap stocks\n\n**Golden rule**: Higher potential returns = Higher risk. Diversification is your best friend!",

    'beginner': "🌱 **Getting Started as a Beginner:**\n\n1. 📚 **Learn first** - Use Investa's Guided Journey\n2. 💰 **Build emergency fund** (3-6 months expenses)\n3. 📊 **Start with index funds** - Simple and effective\n4. 🔄 **Set up SIP** - Automate your investments\n5. ⏰ **Be patient** - Wealth takes time\n\nThe best time to start investing was yesterday. The second best time is NOW!",

    'compound': "🔢 **Compound Interest** - The 8th Wonder of the World!\n\nIf you invest ₹10,000/month at 12% annual return:\n• After 10 years: **₹23 Lakhs**\n• After 20 years: **₹98 Lakhs**  \n• After 30 years: **₹3.5 Crores**\n\nThe secret? Start early and never stop! Even small amounts grow enormously over time.",

    'dividend': "💵 **Dividend Investing** provides regular income from your investments.\n\n**How it works:**\nCompanies share profits → Pay dividends to shareholders → You receive regular cash\n\n**Top dividend sectors:**\n• Utilities\n• Consumer Staples\n• Real Estate (REITs)\n• Bank stocks\n\nDividend reinvestment (DRIP) turbocharges compound growth!",

    'gold': "🥇 **Gold as an Investment:**\n\n**Pros:**\n• Hedge against inflation\n• Safe haven in market crashes\n• Highly liquid\n\n**Cons:**\n• Doesn't generate income\n• Storage costs (physical gold)\n• Lower long-term returns than equities\n\n**Recommendation:** 5-15% of portfolio in gold for diversification. Consider Gold ETFs or Sovereign Gold Bonds.",

    'tax': "💼 **Tax-Efficient Investing in India:**\n\n• **ELSS Funds** - Tax deduction up to ₹1.5 lakh under 80C\n• **PPF** - Tax-free returns, 15-year lock-in\n• **NPS** - Additional ₹50K deduction under 80CCD\n• **LTCG**: Equity >1 year taxed at 10% above ₹1 lakh\n• **STCG**: Equity <1 year taxed at 15%\n\nConsult a financial advisor for personalized tax planning!",

    'default': "🤔 I didn't quite catch that. Here are some topics I can help with:\n\n📊 **Markets**: stocks, ETFs, mutual funds, index funds\n💰 **Strategies**: SIP, portfolio, dividends, compound interest\n🎯 **Planning**: beginner guide, risk assessment, goals\n💡 **Assets**: crypto, gold, REITs, bonds\n\nTry asking about any of these topics!",
};

const findResponse = (message) => {
    const lower = message.toLowerCase();
    for (const [key, value] of Object.entries(botResponses)) {
        if (lower.includes(key)) return value;
    }
    return botResponses.default;
};

const quickTopics = ['Beginner Guide', 'Stocks vs ETFs', 'SIP Benefits', 'Portfolio Tips', 'Crypto Basics', 'Tax Saving'];

function MessageBubble({ msg }) {
    const isBot = msg.role === 'bot';
    return (
        <Box
            sx={{
                display: 'flex', gap: 1.5, mb: 2,
                flexDirection: isBot ? 'row' : 'row-reverse',
                alignItems: 'flex-end',
            }}
        >
            <Avatar sx={{ bgcolor: isBot ? '#007DA3' : '#00897b', width: 32, height: 32, flexShrink: 0 }}>
                {isBot ? <SmartToy sx={{ fontSize: 18 }} /> : <Person sx={{ fontSize: 18 }} />}
            </Avatar>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5, maxWidth: '72%', borderRadius: isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                    bgcolor: isBot ? '#e6f5fa' : '#007DA3',
                    color: isBot ? '#1a2332' : '#fff',
                }}
            >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {msg.text}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5, textAlign: 'right' }}>
                    {msg.time}
                </Typography>
            </Paper>
        </Box>
    );
}

function Chatbot({ user }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm Investa AI, your personal investment assistant.\n\nAsk me anything about investing - stocks, ETFs, portfolio strategies, or financial planning. I'm here to help!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const sendMessage = (text) => {
        const userMsg = {
            role: 'user', text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        setTimeout(() => {
            const response = findResponse(text);
            setTyping(false);
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ]);
        }, 1000 + Math.random() * 500);
    };

    const handleSend = () => {
        if (input.trim()) sendMessage(input.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const resetChat = () => {
        setMessages([{
            role: 'bot',
            text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 Chat cleared. Ask me anything about investing!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
    };

    if (user?.aiAssistant === false) {
        return (
            <Box textAlign="center" py={12} className="fade-in">
                <SmartToy sx={{ fontSize: 80, color: '#cbd5e1', mb: 3 }} />
                <Typography variant="h5" fontWeight={800} gutterBottom>AI Assistant is Disabled</Typography>
                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: 'auto' }}>
                    To get personalized investment advice and chat with our AI, please enable the AI Assistant in your settings.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/settings')} sx={{ borderRadius: 2, fontWeight: 700, px: 4, py: 1.2 }}>
                    Go to Settings
                </Button>
            </Box>
        );
    }

    return (
        <Box className="fade-in" sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ background: 'linear-gradient(135deg, #007DA3, #005b7a)', borderRadius: 1.5, p: 3, mb: 2, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 44, height: 44 }}>
                        <SmartToy sx={{ color: '#fff' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={800}>Investa AI</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#69f0ae' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Online • Investment Assistant</Typography>
                        </Box>
                    </Box>
                </Box>
                <IconButton onClick={resetChat} sx={{ color: '#fff' }} title="Clear chat">
                    <Refresh />
                </IconButton>
            </Box>

            {/* Quick Topics */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {quickTopics.map((t) => (
                    <Chip
                        key={t} label={t} size="small" clickable
                        onClick={() => sendMessage(t)}
                        sx={{ bgcolor: '#e6f5fa', color: '#007DA3', fontWeight: 600, '&:hover': { bgcolor: '#007DA3', color: '#fff' } }}
                    />
                ))}
            </Box>

            {/* Chat Area */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ height: 420, overflowY: 'auto', p: 2 }}>
                        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                        {typing && (
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#007DA3', width: 32, height: 32 }}>
                                    <SmartToy sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Box sx={{ bgcolor: '#e6f5fa', px: 2, py: 1.5, borderRadius: '4px 12px 12px 12px', display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                    {[0, 1, 2].map((i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 8, height: 8, borderRadius: '50%', bgcolor: '#007DA3',
                                                animation: 'bounce 1.4s infinite',
                                                animationDelay: `${i * 0.2}s`,
                                                '@keyframes bounce': {
                                                    '0%, 60%, 100%': { transform: 'translateY(0)' },
                                                    '30%': { transform: 'translateY(-6px)' },
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                        <div ref={bottomRef} />
                    </Box>

                    {/* Input Area */}
                    <Box
                        sx={{
                            display: 'flex', gap: 1, p: 2, borderTop: '1px solid #e0e8f0',
                            bgcolor: '#fafbfc',
                        }}
                    >
                        <TextField
                            fullWidth multiline maxRows={3}
                            placeholder="Ask about stocks, ETFs, portfolio strategies..."
                            value={input} onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fff' },
                            }}
                        />
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim() || typing}
                            sx={{
                                bgcolor: '#007DA3', color: '#fff',
                                '&:hover': { bgcolor: '#005b7a' },
                                '&:disabled': { bgcolor: '#b0bec5' },
                                width: 44, height: 44, alignSelf: 'flex-end',
                            }}
                        >
                            <Send />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
                💡 Investa AI provides educational information only. Not financial advice.
            </Typography>
        </Box>
    );
}

export default Chatbot;
