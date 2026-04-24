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
                        sx={{ color: '#64748b', fontWeight: 600, px: 3, '&:hover': { color: '#007DA3', bgcolor: 'transparent' } }}
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#1e293b',
                            color: '#fff',
                            px: 3,
                            borderRadius: '12px',
                            '&:hover': { bgcolor: '#0f172a' }
                        }}
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </Button>
                </Stack>
            </Box>

            {/* ── HERO SECTION ── */}
            <Box className="mesh-bg" sx={{ pt: { xs: 10, md: 15 }, pb: { xs: 10, md: 20 }, position: 'relative', overflow: 'hidden' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Chip 
                                    label="NEW: VERSION 2.0 IS LIVE" 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, 
                                        mb: 3, px: 1, border: '1px solid #bae6fd' 
                                    }} 
                                />
                                <Typography 
                                    variant="h1" 
                                    sx={{ 
                                        fontWeight: 900, fontSize: { xs: '3rem', md: '5rem' }, 
                                        lineHeight: 1, letterSpacing: -2, color: '#1e293b', mb: 3 
                                    }}
                                >
                                    Master Your <br />
                                    <span className="gradient-text">Financial Future</span>
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#64748b', mb: 6, maxWidth: 540, lineHeight: 1.6, fontWeight: 500 }}>
                                    Investa combines expert guidance with real-time data to help you build a portfolio that stands the test of time. No jargon, just results.
                                </Typography>
                                
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="contained" size="large" endIcon={<ArrowForward />}
                                        sx={{
                                            bgcolor: '#007DA3', px: 5, py: 2, borderRadius: '16px',
                                            boxShadow: '0 10px 20px -5px rgba(0, 125, 163, 0.4)',
                                            fontSize: '1.1rem'
                                        }}
                                        onClick={() => navigate('/register')}
                                    >
                                        Start Your Journey
                                    </Button>
                                    <Button
                                        variant="outlined" size="large" startIcon={<PlayCircleOutline />}
                                        sx={{
                                            borderColor: '#e2e8f0', color: '#1e293b', px: 4, py: 2, borderRadius: '16px',
                                            bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        How it Works
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box 
                                sx={{ 
                                    position: 'relative',
                                    '&::before': {
                                        content: '""', position: 'absolute', top: -40, left: -40, 
                                        width: 200, height: 200, borderRadius: '50%', 
                                        background: 'rgba(0,125,163,0.05)', zIndex: 0
                                    }
                                }}
                            >
                                <Card sx={{ borderRadius: '32px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="subtitle2" fontWeight={900} mb={3} color="#94a3b8" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Live Markets</Typography>
                                        {[
                                            { name: 'S&P 500', val: '4,800.50', up: true },
                                            { name: 'Nasdaq 100', val: '15,210.12', up: true },
                                            { name: 'US 10Y Bond', val: '4.12%', up: false }
                                        ].map((m) => (
                                            <Stack key={m.name} direction="row" justifyContent="space-between" mb={2.5}>
                                                <Typography variant="body1" fontWeight={700} color="#1e293b">{m.name}</Typography>
                                                <Typography variant="body1" fontWeight={900} color={m.up ? '#10b981' : '#ef4444'}>{m.val}</Typography>
                                            </Stack>
                                        ))}
                                        <Divider sx={{ my: 3 }} />
                                        <Typography variant="body2" color="#64748b" sx={{ fontStyle: 'italic' }}>
                                            "The best time to start was yesterday, the second best is now."
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── LOGO CLOUD / TRUST ── */}
            <Container maxWidth="lg" sx={{ mt: -8, mb: 15, position: 'relative', zIndex: 10 }}>
                <Card sx={{ borderRadius: '24px', p: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: 'none' }}>
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={{ xs: 5, md: 2 }} 
                        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
                        justifyContent="space-around"
                        alignItems="center"
                    >
                        {stats.map((s) => (
                            <Box key={s.label} sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={900} color="#1e293b">{s.value}</Typography>
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
            <Box sx={{ py: 15 }}>
                <Container maxWidth="md">
                    <Box 
                        sx={{ 
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                            borderRadius: '40px', p: { xs: 6, md: 10 }, 
                            color: '#fff', textAlign: 'center',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <Typography variant="h3" fontWeight={900} mb={3} sx={{ letterSpacing: -1 }}>
                            Ready to take control?
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8, mb: 5, maxWidth: 480, mx: 'auto' }}>
                            Join 10,000+ investors building wealth with Investa. Register now and get your first guided plan for free.
                        </Typography>
                        <Button
                            variant="contained" size="large"
                            sx={{
                                bgcolor: '#007DA3', px: 6, py: 2, borderRadius: '16px',
                                fontWeight: 800, fontSize: '1.1rem',
                                '&:hover': { bgcolor: '#00b4db' }
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ── FOOTER ── */}
            <Box sx={{ py: 10, borderTop: '1px solid #f1f5f9' }}>
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
