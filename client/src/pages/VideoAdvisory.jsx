import React, { useState } from 'react';
import { Box, Grid, Typography, Button, Dialog, DialogContent, IconButton, Stack } from '@mui/material';
import { PlayCircle, Close, FilterList, Refresh } from '@mui/icons-material';
import TitleCard from '../components/TitleCard';
import InvestmentCard from '../components/InvestmentCard';

const VideoAdvisory = () => {
    const [playing, setPlaying] = useState(null);
    const [tab, setTab] = useState('all');
    const [visibleCount, setVisibleCount] = useState(6);

    const videos = [
        { id: 1, title: 'Understanding Mutual Funds', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800', duration: '12:45', advisor: 'Rahul Sharma', category: 'beginner', riskLevel: 'low', views: '45K', description: 'A comprehensive guide to starting your mutual fund journey with safety and growth.' },
        { id: 2, title: 'Crypto Portfolio Strategy', thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004009?q=80&w=800', duration: '15:20', advisor: 'Ananya Iyer', category: 'intermediate', riskLevel: 'high', views: '120K', description: 'Advanced strategies for balancing high-risk digital assets for maximal returns.' },
        { id: 3, title: 'Stock Market Basics', thumbnail: 'https://images.unsplash.com/photo-1611974714405-1a89c9704e67?q=80&w=800', duration: '10:30', advisor: 'Vikram Seth', category: 'beginner', riskLevel: 'medium', views: '89K', description: 'Core principles of fundamental and technical analysis for new equity investors.' },
        { id: 4, title: 'Retirement Planning 101', thumbnail: 'https://images.unsplash.com/photo-1554224155-16974a4e2591?q=80&w=800', duration: '18:15', advisor: 'Sanjay Gupta', category: 'advanced', riskLevel: 'low', views: '32K', description: 'Securing your future with long-term compounding and tax-efficient strategies.' },
        { id: 5, title: 'Real Estate Investment Trusts', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', duration: '14:50', advisor: 'Priya Mehra', category: 'intermediate', riskLevel: 'medium', views: '15K', description: 'How to invest in commercial properties via REITs with monthly income.' },
        { id: 6, title: 'Passive Income with Dividends', thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800', duration: '08:45', advisor: 'Anita Desai', category: 'beginner', riskLevel: 'low', views: '200K', description: 'Building a reliable monthly income stream using high-yield dividend stocks.' },
        { id: 7, title: 'Options Trading Explained', thumbnail: 'https://images.unsplash.com/photo-1611974714405-1a89c9704e67?q=80&w=800', duration: '22:10', advisor: 'Nikhil Verma', category: 'advanced', riskLevel: 'high', views: '77K', description: 'Mastering calls and puts to hedge your portfolio or generate aggressive returns.' },
        { id: 8, title: 'Gold vs Silver Investing', thumbnail: 'https://images.unsplash.com/photo-1589750670744-dc963aa5041a?q=80&w=800', duration: '11:15', advisor: 'Amitabh J.', category: 'beginner', riskLevel: 'low', views: '55K', description: 'Comparing precious metals as a hedge against inflation and market volatility.' },
        { id: 9, title: 'Emerging Markets Guide', thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800', duration: '16:30', advisor: 'Sarah Khan', category: 'intermediate', riskLevel: 'high', views: '28K', description: 'Finding growth opportunities in developing economies across Asia and Africa.' },
        { id: 10, title: 'ESG & Sustainable Finance', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', duration: '13:00', advisor: 'David Miller', category: 'intermediate', riskLevel: 'medium', views: '19K', description: 'Investing with impact: focusing on Environmental, Social, and Governance factors.' },
        { id: 11, title: 'Intraday Trading Rules', thumbnail: 'https://images.unsplash.com/photo-1535320485706-44d43b919500?q=80&w=800', duration: '20:45', advisor: 'Rajesh Kumar', category: 'intermediate', riskLevel: 'high', views: '150K', description: 'Top 5 rules for risk management when trading stocks within a single day.' },
        { id: 12, title: 'Fixed Deposit Strategies', thumbnail: 'https://images.unsplash.com/photo-1550565118-3d1428df7305?q=80&w=800', duration: '09:20', advisor: 'Pavitra S.', category: 'beginner', riskLevel: 'low', views: '42K', description: 'Maximizing returns from traditional savings using interest rate laddering.' },
        { id: 13, title: 'High-Yield Bonds', thumbnail: 'https://images.unsplash.com/photo-1454165833767-139ec424bd47?q=80&w=800', duration: '15:10', advisor: 'Mark Zhang', category: 'advanced', riskLevel: 'medium', views: '11K', description: 'Understanding corporate debt and when it makes sense to chase higher yields.' },
        { id: 14, title: 'Tech Sector Outlook 2024', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800', duration: '14:25', advisor: 'Leo Bennett', category: 'intermediate', riskLevel: 'medium', views: '95K', description: 'Deep dive into AI, SaaS, and Semiconductor trends driving the tech markets.' },
        { id: 15, title: 'Penny Stock Realities', thumbnail: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=800', duration: '12:00', advisor: 'Akash Gupta', category: 'beginner', riskLevel: 'high', views: '330K', description: 'Debunking myths about quick riches and the real risks of low-cap stocks.' },
    ];

    const filtered = tab === 'all' ? videos : videos.filter(v => v.category === tab);
    const displayedVideos = filtered.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, filtered.length));
    };

    return (
        <Box sx={{ px: { xs: 2, md: 8 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
            <TitleCard 
                title="Video Advisory" 
                subtitle="High-quality video tutorials from certified financial experts."
                action={
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, color: '#4B5563', borderColor: '#D1D5DB' }}
                    >
                        Advanced Filter
                    </Button>
                }
            />

            {/* Level Controls */}
            <Box sx={{ mb: 6, display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                    <Button
                        key={level}
                        onClick={() => {
                            setTab(level);
                            setVisibleCount(6); // Reset visible count on filter change
                        }}
                        sx={{
                            px: 3, py: 1,
                            borderRadius: '24px',
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: tab === level ? '#1F2937' : 'white',
                            color: tab === level ? 'white' : '#4B5563',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            '&:hover': { bgcolor: tab === level ? '#111827' : '#F9FAFB' }
                        }}
                    >
                        {level.toUpperCase()}
                    </Button>
                ))}
            </Box>

            {/* Video Grid */}
            {displayedVideos.length > 0 ? (
                <Grid container spacing={3} justifyContent="center">
                    {displayedVideos.map(video => (
                        <Grid item key={video.id}>
                            <InvestmentCard 
                                item={video} 
                                actionLabel="Watch"
                                onClick={() => setPlaying(video)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <Typography variant="h5" sx={{ color: '#9CA3AF', fontWeight: 600 }}>No videos available in this category</Typography>
                </Box>
            )}

            {/* Load More Button */}
            {visibleCount < filtered.length && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Refresh />}
                        onClick={handleLoadMore}
                        sx={{ 
                            bgcolor: 'white', 
                            color: '#1F2937', 
                            fontWeight: 800,
                            px: 4, py: 1.5,
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            '&:hover': { bgcolor: '#F9FAFB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                        }}
                    >
                        Load More Content
                    </Button>
                </Stack>
            )}

            {/* Cinematic Video Player Modal */}
            <Dialog 
                open={!!playing} 
                onClose={() => setPlaying(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: 'black' } }}
            >
                {playing && (
                    <DialogContent sx={{ p: 0, position: 'relative' }}>
                        <IconButton 
                            onClick={() => setPlaying(null)}
                            sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                        >
                            <Close />
                        </IconButton>
                        <Box sx={{ aspectRatio: '16/9', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ textAlign: 'center', px: 4 }}>
                                <PlayCircle sx={{ fontSize: 100, color: 'white', opacity: 0.8, mb: 3 }} />
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>{playing.title}</Typography>
                                <Typography variant="h6" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
                                    ADVISOR: {playing.advisor} • {playing.duration} • {playing.riskLevel.toUpperCase()} RISK
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                )}
            </Dialog>
        </Box>
    );
};

export default VideoAdvisory;
