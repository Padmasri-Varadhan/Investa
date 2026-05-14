import React from 'react';
import {
    Box, Button, Container, Typography, Grid, Card, CardContent,
    Stack, Chip, Avatar, Divider, IconButton
} from '@mui/material';
import {
    TrendingUp, School, People, Star,
    ArrowForward, Article, Flag, SmartToy,
    MenuBook, QueryStats, Psychology, AutoGraph, Map, Group,
    CheckCircleOutline, PlayCircleOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * ULTRA PREMIUM HOME / LANDING PAGE
 */
const stats = [
    { icon: <School />, value: '50+', label: 'Guides' },
    { icon: <People />, value: '10K+', label: 'Learners' },
    { icon: <Star />, value: '4.8', label: 'Rating' },
];

const features = [
    { title: 'Guided Journey', desc: 'A step-by-step path to mastering the markets, tailored for your level.', color: '#e0f2fe', icon: <Map /> },
    { title: 'Expert Analytics', desc: 'Deep-dives into stocks, ETFs, and crypto with institutional-grade data.', color: '#dcfce7', icon: <QueryStats /> },
    { title: 'AI Advisory', desc: 'Instant answers to any financial question from our dedicated AI bot.', color: '#fef9c3', icon: <Psychology /> },
    { title: 'Goal Mastery', desc: 'Set, track, and achieve your financial targets with precision.', color: '#f3e8ff', icon: <Flag /> },
];

function Home() {
    const navigate = useNavigate();
    
    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            {/* ── STICKY NAV ── */}
            <Box
                sx={{
                    bgcolor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    px: { xs: 2, md: 8 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    borderBottom: '1px solid #f1f5f9',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ bgcolor: '#007DA3', p: 0.8, borderRadius: '10px', display: 'flex' }}>
                        <TrendingUp sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 900, letterSpacing: -0.5 }}>
                        INVESTA
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant="text"
                        sx={{ color: '#007DA3', fontWeight: 600, px: 3, '&:hover': { bgcolor: 'rgba(0, 125, 163, 0.04)' } }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#007DA3',
                            color: '#fff',
                            px: 3,
                            borderRadius: '12px',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#006a8a' }
                        }}
                        onClick={() => navigate('/signup')}
                    >
                        Get Started
                    </Button>
                </Stack>
            </Box>

            {/* ── HERO SECTION ── */}
            <Box className="mesh-bg" sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 10, md: 20 }, position: 'relative', overflow: 'hidden' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={10} lg={8} sx={{ mx: 'auto', textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Chip 
                                    label="LIVE: MARKET DATA INTEGRATED" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'rgba(0, 125, 163, 0.1)', 
                                        color: '#007DA3', 
                                        fontWeight: 900, 
                                        mb: 3, 
                                        borderRadius: '8px',
                                        border: '1px solid rgba(0, 125, 163, 0.2)'
                                    }} 
                                />
                                <Typography 
                                    variant="h1" 
                                    sx={{ 
                                        fontWeight: 900, fontSize: { xs: '2.5rem', md: '4rem' }, 
                                        lineHeight: 1.2, letterSpacing: -1.5, color: '#1e293b', mb: 3 
                                    }}
                                >
                                    The fully dynamic investment platform for the modern era.
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 6, maxWidth: 640, lineHeight: 1.6, fontWeight: 500 }}>
                                    Experience real-time portfolio tracking, AI-driven market news, and personalized financial strategies all in one place.
                                </Typography>
                                
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                    <Button
                                        variant="contained" size="large" endIcon={<ArrowForward />}
                                        sx={{
                                            bgcolor: '#007DA3', px: 5, py: 2, borderRadius: '16px',
                                            boxShadow: '0 10px 20px -5px rgba(0, 125, 163, 0.4)',
                                            fontSize: '1.1rem',
                                            fontWeight: 800,
                                            '&:hover': { bgcolor: '#006a8a' }
                                        }}
                                        onClick={() => navigate('/signup')}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        variant="outlined" size="large" startIcon={<PlayCircleOutline />}
                                        sx={{
                                            px: 4, py: 2, borderRadius: '16px',
                                            borderColor: '#e2e8f0', color: '#64748b',
                                            fontSize: '1.1rem', fontWeight: 700,
                                            '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
                                        }}
                                    >
                                        Watch Demo
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── LOGO CLOUD / TRUST ── */}
            <Container maxWidth="lg" sx={{ mt: -8, mb: 15, position: 'relative', zIndex: 10 }}>
                <Card sx={{ borderRadius: '24px', p: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={{ xs: 5, md: 2 }} 
                        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
                        justifyContent="space-around"
                        alignItems="center"
                    >
                        {stats.map((s) => (
                            <Box key={s.label} sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                    <Typography variant="h3" fontWeight={900} color="#1e293b">{s.value}</Typography>
                                </Box>
                                <Typography variant="body2" color="#94a3b8" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Card>
            </Container>

            {/* ── FEATURES ── */}
            <Box sx={{ py: 15, bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: -1, color: '#1e293b', mb: 2 }}>
                            Built for the next generation.
                        </Typography>
                        <Typography variant="h6" color="#64748b" sx={{ maxWidth: 640, mx: 'auto' }}>
                            We've stripped away the complexity of traditional finance to give you a platform that's as intuitive as it is powerful.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((f) => (
                            <Grid item xs={12} sm={6} md={3} key={f.title}>
                                <Card 
                                    className="premium-card" 
                                    sx={{ 
                                        height: '100%', bgcolor: '#fff', border: 'none', 
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ bgcolor: f.color, width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                            {React.cloneElement(f.icon, { sx: { color: '#007DA3', fontSize: 28 } })}
                                        </Box>
                                        <Typography variant="h6" fontWeight={900} mb={1.5} color="#1e293b">{f.title}</Typography>
                                        <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── CTA ── */}
            <Box sx={{ py: 6 }}>
                <Container maxWidth="md">
                    <Box 
                        sx={{ 
                            bgcolor: '#007DA3', 
                            borderRadius: '40px', p: { xs: 4, md: 8 }, 
                            color: '#fff', textAlign: 'center',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: '0 20px 40px -10px rgba(0, 125, 163, 0.3)'
                        }}
                    >
                        <Typography variant="h3" fontWeight={900} mb={3} sx={{ letterSpacing: -1, color: '#fff' }}>
                            Ready to take control?
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 480, mx: 'auto', color: '#fff' }}>
                            Join 10,000+ investors building wealth with Investa. Register now and get your first guided plan for free.
                        </Typography>
                        <Button
                            variant="contained" size="large"
                            sx={{
                                bgcolor: '#fff', 
                                color: '#007DA3',
                                px: 6, py: 2, borderRadius: '16px',
                                fontWeight: 800, fontSize: '1.1rem',
                                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': { 
                                    bgcolor: '#f3f4f6',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 15px 30px -5px rgba(0,0,0,0.15)'
                                }
                            }}
                            onClick={() => navigate('/signup')}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ── FOOTER ── */}
            <Box sx={{ py: 4, borderTop: '1px solid #f1f5f9' }}>
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="#94a3b8" fontWeight={600}>
                        © 2024 INVESTA. BUILT FOR THE FUTURE OF FINANCE.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

export default Home;
