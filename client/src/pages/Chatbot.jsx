import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, CardContent, Typography, TextField, IconButton,
    Avatar, CircularProgress, Chip, Paper, Button
} from '@mui/material';
import { Send, SmartToy, Person, Refresh } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { queryChatbot } from '../services/api';

/**
 * AI Chatbot Page
 * Investment Q&A chatbot with pre-programmed responses
 */
const quickTopics = ['What is an ETF?', 'How is my portfolio?', 'Latest News', 'SIP Strategy', 'Crypto Risks', 'Tax Saving'];

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
            <Avatar sx={{ 
                bgcolor: isBot ? '#007DA3' : '#334155', 
                width: 32, height: 32, flexShrink: 0,
                boxShadow: isBot ? '0 0 10px rgba(0, 125, 163, 0.3)' : 'none'
            }}>
                {isBot ? <SmartToy sx={{ fontSize: 18 }} /> : <Person sx={{ fontSize: 18 }} />}
            </Avatar>
            <Paper
                elevation={0}
                sx={{
                    p: 2, maxWidth: '80%', 
                    borderRadius: isBot ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                    bgcolor: isBot ? 'rgba(255, 255, 255, 0.9)' : '#007DA3',
                    color: isBot ? '#1e293b' : '#fff',
                    border: isBot ? '1px solid rgba(0, 125, 163, 0.1)' : 'none',
                    backdropFilter: isBot ? 'blur(10px)' : 'none',
                    boxShadow: isBot ? '0 4px 15px rgba(0,0,0,0.05)' : '0 4px 15px rgba(0, 125, 163, 0.2)',
                    '& h3': { fontSize: '1.2rem', mt: 0, mb: 1, fontWeight: 900, color: isBot ? '#007DA3' : '#fff' },
                    '& p': { my: 0.5, lineHeight: 1.7 },
                    '& ul, & ol': { pl: 2, my: 1 },
                    '& li': { mb: 0.5 },
                    '& strong': { color: isBot ? '#007DA3' : '#fff', fontWeight: 800 }
                }}
            >
                <Typography variant="body2" component="div">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', mt: 1, textAlign: isBot ? 'left' : 'right', fontWeight: 700 }}>
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
    const [lastTopic, setLastTopic] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const sendMessage = async (text) => {
        const userMsg = {
            role: 'user', text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        try {
            const response = await queryChatbot({ message: text, lastTopic });
            const { text: responseText, topic } = response.data;
            
            if (topic) setLastTopic(topic);

            setTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text: responseText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        } catch (err) {
            console.error("Chatbot error:", err);
            setTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'bot',
                    text: "I'm having trouble connecting to my brain right now. Please try again in a moment!",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        }
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
        setLastTopic(null);
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

