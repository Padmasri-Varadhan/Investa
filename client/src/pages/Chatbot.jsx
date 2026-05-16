import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, CardContent, Typography, TextField, IconButton,
    Avatar, CircularProgress, Chip, Paper, Button, List, ListItem, ListItemButton, ListItemText, Divider
} from '@mui/material';
import { Send, SmartToy, Person, Refresh, Add, Delete, ChatBubbleOutline } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { queryChatbot, getConversations, getMessages, deleteConversation } from '../services/api';

const quickTopics = ['What is an ETF?', 'How is my portfolio?', 'Latest News', 'SIP Strategy', 'Crypto Risks', 'Tax Saving'];

function MessageBubble({ msg, onAction }) {
    const isBot = msg.role === 'bot';
    return (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'flex-end' }}>
            <Avatar sx={{ 
                bgcolor: isBot ? '#007DA3' : '#334155', 
                width: 32, height: 32, flexShrink: 0,
                boxShadow: isBot ? '0 0 10px rgba(0, 125, 163, 0.3)' : 'none'
            }}>
                {isBot ? <SmartToy sx={{ fontSize: 18 }} /> : <Person sx={{ fontSize: 18 }} />}
            </Avatar>
            <Paper elevation={0} sx={{
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
            }}>
                <Typography variant="body2" component="div">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Typography>
                
                {msg.recommendedModule && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,125,163,0.05)', border: '1px solid rgba(0,125,163,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">RECOMMENDED MODULE</Typography>
                            <Typography variant="body2" fontWeight={800} color="#007DA3">{msg.recommendedModule}</Typography>
                        </Box>
                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }} onClick={() => onAction(`Go to ${msg.recommendedModule}`)}>
                            Explore
                        </Button>
                    </Box>
                )}

                {msg.quickActions && msg.quickActions.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {msg.quickActions.map((action, idx) => (
                            <Button 
                                key={idx} size="small" variant="contained" 
                                sx={{ bgcolor: isBot ? '#007DA3' : '#fff', color: isBot ? '#fff' : '#007DA3', borderRadius: 4, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                                onClick={() => onAction(action.label)}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 1, fontWeight: 600 }}>Suggested Questions:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {msg.suggestedFollowUps.map((followUp, idx) => (
                                <Chip 
                                    key={idx} label={followUp} size="small" clickable 
                                    onClick={() => onAction(followUp)}
                                    sx={{ 
                                        bgcolor: isBot ? 'rgba(0,125,163,0.1)' : 'rgba(255,255,255,0.2)', 
                                        color: isBot ? '#007DA3' : '#fff', fontWeight: 600, 
                                        '&:hover': { bgcolor: isBot ? '#007DA3' : '#fff', color: isBot ? '#fff' : '#007DA3' } 
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

function Chatbot({ user }) {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    
    const initialGreeting = {
        role: 'bot',
        text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I’m Investa AI. Ask me anything about investments, stocks, real estate, or wealth building.\n\nNeed help choosing investment ideas or understanding the market? I’m here to help.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const [messages, setMessages] = useState([initialGreeting]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const loadConversations = async () => {
        try {
            const res = await getConversations();
            setConversations(res.data);
        } catch (error) {
            console.error('Failed to load conversations', error);
        }
    };

    const loadMessages = async (id) => {
        try {
            const res = await getMessages(id);
            if (res.data.length > 0) {
                setMessages(res.data.map(m => ({ ...m, time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
            } else {
                setMessages([initialGreeting]);
            }
            setCurrentConversationId(id);
        } catch (error) {
            console.error('Failed to load messages', error);
        }
    };

    const startNewChat = () => {
        setCurrentConversationId(null);
        setMessages([initialGreeting]);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteConversation(id);
            setConversations(conversations.filter(c => c._id !== id));
            if (currentConversationId === id) startNewChat();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const sendMessage = async (text) => {
        const userMsg = { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        try {
            // Only send the last 10 messages for context memory
            const history = messages.slice(-10).map(m => ({ role: m.role, text: m.text }));
            const response = await queryChatbot({ message: text, history, conversationId: currentConversationId });
            const { text: responseText, complexity, recommendedModule, suggestedFollowUps, quickActions, conversationId } = response.data;
            
            if (!currentConversationId && conversationId) {
                setCurrentConversationId(conversationId);
                loadConversations(); // refresh sidebar title
            }

            setTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    role: 'bot', text: responseText, complexity, recommendedModule, suggestedFollowUps, quickActions,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
            ]);
        } catch (err) {
            console.error("Chatbot error:", err);
            setTyping(false);
            setMessages(prev => [
                ...prev,
                { role: 'bot', text: "I'm having trouble connecting to my brain right now. Please try again in a moment!" }
            ]);
        }
    };

    const handleSend = () => { if (input.trim()) sendMessage(input.trim()); };
    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

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
        <Box className="fade-in" sx={{ display: 'flex', gap: 3, maxWidth: 1200, mx: 'auto', height: '80vh' }}>
            
            {/* Sidebar (Chat History) */}
            <Paper elevation={0} sx={{ width: 280, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                    <Button fullWidth variant="contained" startIcon={<Add />} onClick={startNewChat} sx={{ bgcolor: '#007DA3', '&:hover': { bgcolor: '#005b7a' }, borderRadius: 2, fontWeight: 700, py: 1 }}>
                        New Chat
                    </Button>
                </Box>
                <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                    {conversations.map(conv => (
                        <ListItem key={conv._id} disablePadding secondaryAction={
                            <IconButton edge="end" onClick={(e) => handleDelete(e, conv._id)} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        }>
                            <ListItemButton selected={currentConversationId === conv._id} onClick={() => loadMessages(conv._id)} sx={{ borderBottom: '1px solid #f1f5f9', '&.Mui-selected': { bgcolor: 'rgba(0,125,163,0.1)' } }}>
                                <ChatBubbleOutline sx={{ fontSize: 18, color: '#64748b', mr: 1.5 }} />
                                <ListItemText primary={conv.title} primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: currentConversationId === conv._id ? '#007DA3' : '#334155', noWrap: true }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Main Chat Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                <Box sx={{ background: 'linear-gradient(135deg, #007DA3, #005b7a)', borderRadius: 1.5, p: 3, mb: 2, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
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
                </Box>

                {!currentConversationId && messages.length <= 1 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {quickTopics.map(t => (
                            <Chip key={t} label={t} size="small" clickable onClick={() => sendMessage(t)}
                                sx={{ bgcolor: '#e6f5fa', color: '#007DA3', fontWeight: 600, '&:hover': { bgcolor: '#007DA3', color: '#fff' } }}
                            />
                        ))}
                    </Box>
                )}

                <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                    <Box sx={{ p: 0, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} onAction={sendMessage} />)}
                            {typing && (
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: '#007DA3', width: 32, height: 32 }}><SmartToy sx={{ fontSize: 18 }} /></Avatar>
                                    <Box sx={{ bgcolor: '#e6f5fa', px: 2, py: 1.5, borderRadius: '4px 12px 12px 12px', display: 'flex', gap: 0.5 }}>
                                        {[0, 1, 2].map(i => <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#007DA3', animation: 'bounce 1.4s infinite', animationDelay: `${i * 0.2}s`, '@keyframes bounce': { '0%, 60%, 100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-6px)' } } }} />)}
                                    </Box>
                                </Box>
                            )}
                            <div ref={bottomRef} />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, p: 2, borderTop: '1px solid #e0e8f0', bgcolor: '#fafbfc' }}>
                            <TextField fullWidth multiline maxRows={3} placeholder="Ask about stocks, ETFs, portfolio strategies..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fff' } }} />
                            <IconButton onClick={handleSend} disabled={!input.trim() || typing} sx={{ bgcolor: '#007DA3', color: '#fff', '&:hover': { bgcolor: '#005b7a' }, '&:disabled': { bgcolor: '#b0bec5' }, width: 44, height: 44, alignSelf: 'flex-end' }}>
                                <Send />
                            </IconButton>
                        </Box>
                    </Box>
                </Card>

                <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
                    💡 Investa AI provides educational information only. Not financial advice.
                </Typography>
            </Box>
        </Box>
    );
}

export default Chatbot;
