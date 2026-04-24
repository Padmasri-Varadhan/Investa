import React, { useState } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent,
    Avatar, Button, Chip, Stack, Divider, List, ListItem, ListItemText,
    ListItemIcon, IconButton, Tab, Tabs, LinearProgress
} from '@mui/material';
import {
    Edit, Email, Work, Favorite, Comment, Bookmark,
    History, TrendingUp, AccountBalance, CurrencyBitcoin,
    Savings, WorkspacePremium, Info, Article, Person, ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

function Profile({ user, onUpdateUser }) {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const avatarUrl = user?.avatar || '';
    const name = user?.name || 'User Name';
    const email = user?.email || '';

    const getInitials = (n) => {
        if (!n) return 'U';
        return n.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);
    };

    const interests = user?.interests || ['Stocks', 'Mutual Funds', 'Gold', 'Real Estate'];
    
    // Mock data for display - in a real app these could be in the user object
    const savedArticles = [
        { title: 'The Future of Tech ETFs', date: 'Mar 10, 2024', category: 'ETFs' },
        { title: 'Understanding Mutual Fund Ratios', date: 'Mar 5, 2024', category: 'Mutual Funds' }
    ];

    const stats = [
        { label: 'Investment Tier', value: 'Silver', icon: <WorkspacePremium sx={{ color: '#C0C0C0' }} /> },
        { label: 'Courses Done', value: '4', icon: <Info color="primary" /> },
        { label: 'Saved Items', value: savedArticles.length, icon: <Bookmark color="secondary" /> },
        { label: 'Goals Set', value: user?.goals?.length || 3, icon: <TrendingUp color="success" /> }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box className="fade-in">
                <PageHeader 
                    title="My Profile" 
                    subtitle="View and manage your investment identity"
                    icon={<Person />}
                    action={
                        <Button 
                            variant="outlined" 
                            color="error" 
                            startIcon={<ExitToApp />} 
                            onClick={onLogout}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                        >
                            Logout
                        </Button>
                    }
                />
                {/* Profile Header Card */}
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'visible', mb: 4 }}>
                    <Box sx={{ height: 160, background: 'linear-gradient(135deg, #007DA3, #005b7a)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                    <CardContent sx={{ px: { xs: 2, md: 5 }, pb: 5, mt: -10 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-end' }, gap: 3, mb: 4 }}>
                            <Avatar
                                src={avatarUrl}
                                sx={{
                                    width: 160, height: 160,
                                    border: '6px solid #fff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    bgcolor: '#007DA3', fontSize: 56, fontWeight: 700
                                }}
                            >
                                {getInitials(name)}
                            </Avatar>
                            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, pb: 1 }}>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#1a2332', mb: 0.5 }}>{name}</Typography>
                                <Typography variant="h6" color="primary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1 }}>
                                    <Email fontSize="small" /> {email}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => navigate('/settings')}
                                sx={{ bgcolor: '#1a2332', borderRadius: 2, textTransform: 'none', px: 4, py: 1.2, fontWeight: 700, '&:hover': { bgcolor: '#000' } }}
                            >
                                Edit Profile
                            </Button>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ borderLeft: '4px solid #007DA3', pl: 1.5, mb: 2 }}>About Me</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem', mb: 4 }}>
                                    {user?.bio || 'You haven\'t added a bio yet. Tell the community about your investment philosophy and goals in settings.'}
                                </Typography>

                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ borderLeft: '4px solid #007DA3', pl: 1.5, mb: 2 }}>My Interests</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1.5}>
                                    {interests.map((interest) => (
                                        <Chip
                                            key={interest}
                                            label={interest}
                                            variant="outlined"
                                            sx={{ 
                                                fontWeight: 700, 
                                                borderColor: '#007DA3', 
                                                color: '#007DA3',
                                                bgcolor: 'rgba(0,125,163,0.03)',
                                                px: 1
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box sx={{ bgcolor: '#f8fafc', p: 3.5, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="h6" fontWeight={800} mb={3}>Quick Stats</Typography>
                                    <Grid container spacing={2}>
                                        {stats.map((s) => (
                                            <Grid item xs={6} key={s.label}>
                                                <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 3, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                                                    <Box sx={{ mb: 1 }}>{s.icon}</Box>
                                                    <Typography variant="h6" fontWeight={800}>{s.value}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>{s.label}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="subtitle2" fontWeight={800} display="flex" justifyContent="space-between" mb={1}>
                                            Overall Progress <span>66%</span>
                                        </Typography>
                                        <LinearProgress variant="determinate" value={66} sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#007DA3' } }} />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Content Tabs */}
                <Box>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        sx={{ 
                            mb: 3,
                            '& .MuiTabs-indicator': { height: 3, borderRadius: 3 },
                            '& .MuiTab-root': { fontWeight: 800, fontSize: '0.95rem', textTransform: 'none', minHeight: 48 }
                        }}
                    >
                        <Tab label="Saved Articles" />
                        <Tab label="Recent Activity" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {savedArticles.map((art, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                                <Chip label={art.category} size="small" sx={{ bgcolor: '#e6f5fa', color: '#007DA3', fontWeight: 700 }} />
                                            </Box>
                                            <Typography variant="h6" fontWeight={800} mb={1}>{art.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{art.date}</Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Button size="small" fullWidth endIcon={<Article />} onClick={() => navigate('/articles')}>Read Now</Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {tabValue === 1 && (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <History sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
                            <Typography color="text.secondary" fontWeight={600}>No recent activity to show.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default Profile;
