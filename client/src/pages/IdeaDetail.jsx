import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Chip, Button,
    CircularProgress, Alert, LinearProgress, Tooltip,
    Snackbar, Divider, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import {
    ArrowForward, Shield, Warning, Bolt,
    AccessTime, TrendingUp,
    Bookmark, BookmarkBorder, Share, OpenInNew,
    CalendarToday, Category,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdeaById } from '../services/api';
import StructuredContent from '../components/StructuredContent';

/**
 * IdeaDetail Page
 * Full detailed view for a single Investment Idea.
 * Route: /idea/:id
 */

// ─── Config Maps (kept in sync with InvestmentIdeas.jsx) ────────────────────
const riskConfig = {
    low:    { color: '#2e7d32', bg: '#e8f5e9', icon: <Shield />,   label: 'Low Risk',    barColor: '#4caf50' },
    medium: { color: '#e65100', bg: '#fff3e0', icon: <Warning />,  label: 'Medium Risk', barColor: '#ff9800' },
    high:   { color: '#c62828', bg: '#ffebee', icon: <Bolt />,     label: 'High Risk',   barColor: '#f44336' },
};

const categoryLabels = {
    'Savings Account': '🏦 Savings',
    'Fixed Deposit (FD)': '🔒 Fixed Deposit',
    'Recurring Deposit (RD)': '🔄 Recurring Deposit',
    'Public Provident Fund (PPF)': '🏛️ PPF',
    'Employee Provident Fund (EPF)': '🏢 EPF',
    'National Pension System (NPS)': '👴 NPS',
    'Gold Investment': '🥇 Gold',
    'Government Schemes': '📜 Govt Schemes',
    'Corporate Bonds': '🏢 Corporate Bonds',
    'Treasury Bills': '📄 T-Bills',
    'REITs': '🏢 REITs',
    'International Investments': '🌍 International',
    'Mutual Funds': '💼 Mutual Funds',
    'SIP Investments': '🔄 SIP',
    'Stocks': '📊 Stocks',
    'Cryptocurrency': '₿ Crypto',
    'Real Estate': '🏘️ Real Estate',
    'ETFs': '🔗 ETFs',
    'Index Funds': '📈 Index Funds'
};

const horizonLabels = {
    short_term:  'Short-term (< 3 years)',
    medium_term: 'Medium-term (3–7 years)',
    long_term:   'Long-term (7+ years)',
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

// ─── Related Idea Mini-Card ───────────────────────────────────────────────────
function RelatedCard({ idea, onNavigate }) {
    if (!idea) return null;
    const risk = riskConfig[idea.riskLevel] || riskConfig.medium;
    return (
        <Card
            onClick={() => onNavigate(idea._id)}
            sx={{
                cursor: 'pointer',
                borderRadius: '24px',
                bgcolor: '#fff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ width: 36, height: 36, bgcolor: risk.bg, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {categoryLabels[idea.category]?.split(' ')[0] || '💡'}
                    </Box>
                    <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.3, color: '#1a2332' }}>
                        {idea.title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                        label={risk.label} size="small"
                        sx={{ bgcolor: risk.bg, color: risk.color, fontWeight: 700, fontSize: 10 }}
                    />
                    <Typography variant="caption" sx={{ color: '#007DA3', fontWeight: 800 }}>
                        {idea.expectedReturn || idea.expectedReturns}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Main Detail Page ─────────────────────────────────────────────────────────
function IdeaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [idea, setIdea] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookmarked, setBookmarked] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: '' });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getIdeaById(id);
                // The API returns the idea object directly as res.data
                const ideaData = res.data.idea || res.data;
                setIdea(ideaData);
                setRelated(res.data.related || []);
                const saved = JSON.parse(localStorage.getItem('investaBookmarks') || '[]');
                setBookmarked(saved.includes(id));
            } catch (err) {
                setError(
                    err.response?.status === 404
                        ? 'Investment idea not found.'
                        : 'Failed to load details. Please ensure the backend is running.'
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleBookmark = () => {
        const saved = JSON.parse(localStorage.getItem('investaBookmarks') || '[]');
        let updated;
        if (bookmarked) {
            updated = saved.filter((b) => b !== id);
            setSnack({ open: true, msg: 'Bookmark removed.' });
        } else {
            updated = [...saved, id];
            setSnack({ open: true, msg: '📌 Idea bookmarked!' });
        }
        localStorage.setItem('investaBookmarks', JSON.stringify(updated));
        setBookmarked(!bookmarked);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: idea?.title, url: window.location.href }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            setSnack({ open: true, msg: '🔗 Link copied to clipboard!' });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={16}>
                <CircularProgress size={52} thickness={5} sx={{ color: '#007DA3' }} />
                <Typography mt={3} color="text.secondary" fontWeight={600}>
                    Loading investment details...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="fade-in" sx={{ p: 4, minHeight: '100vh', bgcolor: '#F5F9FC', overflowY: 'auto' }}>
                <Button
                    startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => navigate('/investment-ideas')}
                    sx={{ mb: 3, color: '#007DA3', fontWeight: 700 }}
                >
                    Back to Ideas
                </Button>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!idea) {
        return (
            <Box className="fade-in" sx={{ p: 4, minHeight: '100vh', bgcolor: '#F5F9FC', overflowY: 'auto' }}>
                <Button
                    startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => navigate('/investment-ideas')}
                    sx={{ mb: 3, color: '#007DA3', fontWeight: 700 }}
                >
                    Back to Ideas
                </Button>
                <Alert severity="warning" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
                    Investment idea content is unavailable.
                </Alert>
            </Box>
        );
    }

    const risk = riskConfig[idea.riskLevel] || riskConfig.medium;
    const catLabel = categoryLabels[idea.category] || idea.category;
    const horizonLabel = horizonLabels[idea.horizon || idea.investmentHorizon || idea.timeHorizon] || idea.horizon || idea.timeHorizon || '—';

    return (
        <Box className="fade-in" sx={{ minHeight: '100vh', overflowY: 'auto', bgcolor: '#F5F9FC', p: { xs: 2, md: 4, lg: 6 } }}>
            <Button
                startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                onClick={() => navigate('/investment-ideas')}
                sx={{ mb: 4, color: '#007DA3', fontWeight: 800 }}
            >
                Back to Investment Ideas
            </Button>

            <Grid container spacing={4}>
                {/* ── Main Content Full Width ── */}
                <Grid item xs={12}>
                    <Card sx={{ mb: 4, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                        {(idea.image || idea.imageUrl) && (
                            <Box
                                sx={{
                                    height: 300,
                                    background: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${idea.image || idea.imageUrl}) center/cover no-repeat`,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    p: 4,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={catLabel}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 800, fontSize: 13, px: 1 }}
                                    />
                                    <Chip
                                        icon={React.cloneElement(risk.icon, { fontSize: 'small', sx: { color: risk.color } })}
                                        label={risk.label}
                                        sx={{ bgcolor: risk.bg, color: risk.color, fontWeight: 800, px: 1 }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 2 }}>
                                <Typography variant="h3" fontWeight={900} sx={{ color: '#007DA3', lineHeight: 1.2, flex: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                                    {idea.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                    <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark this idea'}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={bookmarked ? <Bookmark /> : <BookmarkBorder />}
                                            onClick={handleBookmark}
                                            sx={{
                                                borderRadius: 3,
                                                fontWeight: 800,
                                                color: bookmarked ? '#007DA3' : '#64748b',
                                                borderColor: bookmarked ? '#007DA3' : '#cbd5e1',
                                            }}
                                        >
                                            {bookmarked ? 'Saved' : 'Save'}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Share this idea">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<Share />}
                                            onClick={handleShare}
                                            sx={{ borderRadius: 3, fontWeight: 800, color: '#64748b', borderColor: '#cbd5e1' }}
                                        >
                                            Share
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {idea.tags?.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                                    {idea.tags.map((tag) => (
                                        <Chip key={tag} label={`#${tag}`} size="small" sx={{ fontWeight: 700, fontSize: 12, bgcolor: '#f1f5f9', color: '#475569' }} />
                                    ))}
                                </Box>
                            )}

                            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.75, mb: 4, fontSize: '1rem', fontWeight: 400 }}>
                                {idea.overview || idea.description}
                            </Typography>

                            <Divider sx={{ mb: 4 }} />

                            {/* Detailed content renderer */}
                            <StructuredContent content={idea.detailedContent || idea.content} />
                        </CardContent>
                    </Card>

                    {/* Pros & Cons Card */}
                    {(idea.pros?.length > 0 || idea.cons?.length > 0) && (
                        <Card sx={{ mb: 4, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography variant="h5" fontWeight={900} mb={4} sx={{ color: '#007DA3' }}>
                                    Pros &amp; Cons
                                </Typography>
                                <Grid container spacing={4}>
                                    {/* Pros */}
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', p: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                                            <Typography variant="h6" fontWeight={800} color="#0f172a" mb={3}>
                                                Advantages
                                            </Typography>
                                            <List dense disablePadding>
                                                {idea.pros.map((pro, i) => (
                                                    <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', py: 1 }}>
                                                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                                                            <Box component="span" sx={{ color: '#007DA3', fontWeight: 900, fontSize: '1.2rem' }}>•</Box>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={pro}
                                                            primaryTypographyProps={{ variant: 'body1', fontWeight: 600, color: '#374151' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Grid>

                                    {/* Cons */}
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', p: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                                            <Typography variant="h6" fontWeight={800} color="#0f172a" mb={3}>
                                                Risks &amp; Drawbacks
                                            </Typography>
                                            <List dense disablePadding>
                                                {idea.cons.map((con, i) => (
                                                    <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', py: 1 }}>
                                                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                                                            <Box component="span" sx={{ color: '#007DA3', fontWeight: 900, fontSize: '1.2rem' }}>•</Box>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={con}
                                                            primaryTypographyProps={{ variant: 'body1', fontWeight: 600, color: '#374151' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* ── BOTTOM 2-COLUMN GRID: Stats + Related ── */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4 }}>
                        {/* Key Metrics Card */}
                        <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', height: '100%' }}>
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography variant="h5" fontWeight={900} mb={4} sx={{ color: '#007DA3' }}>
                                    Key Metrics
                                </Typography>

                                {/* Risk Level */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight={800}>RISK LEVEL</Typography>
                                        <Chip
                                            icon={React.cloneElement(risk.icon, { fontSize: 'small' })}
                                            label={risk.label}
                                            size="small"
                                            sx={{ bgcolor: risk.bg, color: risk.color, fontWeight: 800 }}
                                        />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={idea.riskLevel === 'low' ? 33 : idea.riskLevel === 'medium' ? 66 : 100}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: risk.barColor } }}
                                    />
                                </Box>

                                <Divider sx={{ mb: 4 }} />

                                {/* Stat rows */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 4 }}>
                                    {[
                                        { icon: <TrendingUp sx={{ color: '#007DA3', fontSize: 24 }} />, label: 'Expected Returns', value: idea.expectedReturn || idea.expectedReturns || '—' },
                                        { icon: <AccessTime sx={{ color: '#007DA3', fontSize: 24 }} />, label: 'Time Horizon', value: horizonLabel },
                                        { icon: <Category sx={{ color: '#007DA3', fontSize: 24 }} />, label: 'Category', value: catLabel },
                                        { icon: <CalendarToday sx={{ color: '#007DA3', fontSize: 24 }} />, label: 'Published', value: formatDate(idea.createdAt) },
                                    ].map(({ icon, label, value }) => (
                                        <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ mt: 0.5 }}>{icon}</Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={800} display="block" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
                                                    {label}
                                                </Typography>
                                                <Typography variant="body1" fontWeight={800} sx={{ color: '#1a2332' }}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider sx={{ mb: 4 }} />

                                {/* Allocation bar */}
                                {idea.allocation && (
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight={800}>SUGGESTED ALLOCATION</Typography>
                                            <Typography variant="subtitle2" fontWeight={900} color="#007DA3">{idea.allocation}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate" value={idea.allocation}
                                            sx={{ height: 10, borderRadius: 5, bgcolor: '#e6f5fa', '& .MuiLinearProgress-bar': { bgcolor: '#007DA3' } }}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
                                            of total portfolio
                                        </Typography>
                                    </Box>
                                )}

                                {/* Suitable For */}
                                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight={800} display="block" mb={1}>SUITABLE FOR</Typography>
                                    <Typography variant="h6" fontWeight={800} sx={{ textTransform: 'capitalize', color: '#0f172a' }}>
                                        {idea.suitableFor === 'all' ? 'All Investor Levels' : idea.suitableFor?.replace('_', ' ') || '—'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Related Ideas Card */}
                        {related.length > 0 && (
                            <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ p: { xs: 3, md: 5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" fontWeight={900} mb={4} sx={{ color: '#007DA3' }}>
                                        Related Ideas
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 'auto' }}>
                                        {related.map((r) => (
                                            <RelatedCard
                                                key={r._id}
                                                idea={r}
                                                onNavigate={(rid) => navigate(`/idea/${rid}`)}
                                            />
                                        ))}
                                    </Box>
                                    <Button
                                        fullWidth variant="outlined"
                                        endIcon={<OpenInNew />}
                                        onClick={() => navigate('/investment-ideas')}
                                        sx={{ mt: 4, borderRadius: 3, fontWeight: 800, color: '#007DA3', borderColor: '#007DA3', py: 1.5 }}
                                    >
                                        View All Ideas
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Grid>

                {/* ── INTELLIGENT RECOMMENDATIONS ── */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', bgcolor: '#007DA3', color: '#fff' }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" fontWeight={900} mb={2}>
                                    Take the next step in learning
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                                    {idea.category === 'Stocks' || idea.category === 'ETFs' || idea.category === 'Index Funds' ? 
                                        'Ready to dive deeper into equity markets? Check out our Video Advisory on Stock Market Basics or read related articles to build a stronger portfolio.' :
                                    idea.category === 'Real Estate' || idea.category === 'REITs' ?
                                        'Property investment requires deep understanding of market trends. Read our comprehensive guides on Real Estate investing.' :
                                    idea.category === 'Mutual Funds' || idea.category === 'SIP Investments' ?
                                        'Harness the power of compounding. Explore our SIP learning content and start your journey towards automated wealth creation.' :
                                        'Expand your financial knowledge by exploring our extensive library of articles and expert videos tailored to your interests.'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button 
                                        variant="contained" 
                                        sx={{ bgcolor: '#fff', color: '#007DA3', fontWeight: 800, borderRadius: 3, '&:hover': { bgcolor: '#f8fafc' } }}
                                        onClick={() => navigate('/articles')}
                                    >
                                        Explore Articles
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        sx={{ borderColor: '#fff', color: '#fff', fontWeight: 800, borderRadius: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' } }}
                                        onClick={() => navigate('/video-advisory')}
                                    >
                                        Watch Videos
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Bolt sx={{ fontSize: 100, opacity: 0.2 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="success"
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default IdeaDetail;
