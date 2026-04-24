import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Chip, Button,
    CircularProgress, Alert, LinearProgress, Tooltip,
    Snackbar, Divider, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import {
    ArrowForward, Shield, Warning, Bolt,
    CheckCircle, Cancel, AccessTime, TrendingUp,
    Bookmark, BookmarkBorder, Share, OpenInNew,
    CalendarToday, Category,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdeaById } from '../services/api';

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
    index_fund:  '📈 Index Fund',
    etf:         '🔗 ETF',
    stocks:      '📊 Stocks',
    real_estate: '🏘️ Real Estate',
    bonds:       '💵 Bonds',
    crypto:      '₿ Crypto',
    mutual_fund: '💼 Mutual Fund',
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
    const risk = riskConfig[idea.riskLevel] || riskConfig.medium;
    return (
        <Card
            onClick={() => onNavigate(idea._id)}
            sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
                border: `1px solid ${risk.bg}`,
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{ width: 36, height: 36, bgcolor: risk.bg, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {categoryLabels[idea.category]?.split(' ')[0] || '💡'}
                    </Box>
                    <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.3 }}>
                        {idea.title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                        label={risk.label} size="small"
                        sx={{ bgcolor: risk.bg, color: risk.color, fontWeight: 700, fontSize: 10 }}
                    />
                    <Typography variant="caption" color="primary" fontWeight={700}>
                        {idea.expectedReturn}
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
                setIdea(res.data.idea);
                setRelated(res.data.related || []);
                // Restore bookmark state from localStorage
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

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <Box textAlign="center" py={16}>
                <CircularProgress size={52} thickness={5} />
                <Typography mt={3} color="text.secondary" fontWeight={600}>
                    Loading investment details...
                </Typography>
            </Box>
        );
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (error) {
        return (
            <Box className="fade-in">
                <Button
                    startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => navigate('/investment-ideas')}
                    sx={{ mb: 3, color: '#546e7a', fontWeight: 700 }}
                >
                    Back to Ideas
                </Button>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    const risk = riskConfig[idea.riskLevel] || riskConfig.medium;
    const catLabel = categoryLabels[idea.category] || idea.category;
    const horizonLabel = horizonLabels[idea.investmentHorizon] || idea.timeHorizon || '—';

    return (
        <Box className="fade-in">
            {/* ── Back Navigation ── */}
            <Button
                startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                onClick={() => navigate('/investment-ideas')}
                sx={{ mb: 3, color: '#546e7a', fontWeight: 700 }}
            >
                Back to Investment Ideas
            </Button>

            <Grid container spacing={3}>
                {/* ── LEFT COLUMN: Main Content ── */}
                <Grid item xs={12} lg={8}>

                    {/* Hero Card */}
                    <Card sx={{ mb: 3, overflow: 'hidden' }}>
                        {/* Cover image */}
                        {idea.imageUrl && (
                            <Box
                                sx={{
                                    height: 240,
                                    background: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${idea.imageUrl}) center/cover no-repeat`,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    p: 3,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={catLabel}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 800, fontSize: 12 }}
                                    />
                                    <Chip
                                        icon={React.cloneElement(risk.icon, { fontSize: 'small', sx: { color: risk.color } })}
                                        label={risk.label}
                                        sx={{ bgcolor: risk.bg, color: risk.color, fontWeight: 800 }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                            {/* Title row */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2 }}>
                                <Typography variant="h4" fontWeight={900} sx={{ color: '#1a2332', lineHeight: 1.2, flex: 1 }}>
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
                                                fontWeight: 700,
                                                color: bookmarked ? '#007DA3' : undefined,
                                                borderColor: bookmarked ? '#007DA3' : undefined,
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
                                            sx={{ borderRadius: 3, fontWeight: 700 }}
                                        >
                                            Share
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Tags */}
                            {idea.tags?.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
                                    {idea.tags.map((tag) => (
                                        <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 11 }} />
                                    ))}
                                </Box>
                            )}

                            {/* Short description */}
                            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3, fontStyle: 'italic', fontSize: '1.05rem', borderLeft: '3px solid #007DA3', pl: 2 }}>
                                {idea.description}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {/* Full content */}
                            {idea.content && (
                                <Box mb={2}>
                                    {idea.content.split('\n\n').map((para, idx) => (
                                        <Typography key={idx} variant="body1" mb={2.5} sx={{ lineHeight: 1.9, color: '#334155', fontSize: '1rem' }}>
                                            {para}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pros & Cons Card */}
                    {(idea.pros?.length > 0 || idea.cons?.length > 0) && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                                <Typography variant="h6" fontWeight={800} mb={3} sx={{ color: '#1a2332' }}>
                                    Pros &amp; Cons
                                </Typography>
                                <Grid container spacing={3}>
                                    {/* Pros */}
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ bgcolor: '#f0fdf4', borderRadius: 2, p: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={800} color="#2e7d32" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CheckCircle fontSize="small" /> Advantages
                                            </Typography>
                                            <List dense disablePadding>
                                                {idea.pros.map((pro, i) => (
                                                    <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', py: 0.4 }}>
                                                        <ListItemIcon sx={{ minWidth: 28, mt: 0.2 }}>
                                                            <CheckCircle fontSize="small" sx={{ color: '#4caf50' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={pro}
                                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#2d4a2d' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Grid>

                                    {/* Cons */}
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ bgcolor: '#fff5f5', borderRadius: 2, p: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={800} color="#c62828" mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Cancel fontSize="small" /> Risks &amp; Drawbacks
                                            </Typography>
                                            <List dense disablePadding>
                                                {idea.cons.map((con, i) => (
                                                    <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start', py: 0.4 }}>
                                                        <ListItemIcon sx={{ minWidth: 28, mt: 0.2 }}>
                                                            <Cancel fontSize="small" sx={{ color: '#f44336' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={con}
                                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: '#4a1f1f' }}
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

                {/* ── RIGHT COLUMN: Stats + Related ── */}
                <Grid item xs={12} lg={4}>

                    {/* Key Metrics Card */}
                    <Card sx={{ mb: 3, position: { lg: 'sticky' }, top: { lg: 80 } }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} mb={2.5} sx={{ color: '#1a2332' }}>
                                Key Metrics
                            </Typography>

                            {/* Risk Level */}
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>RISK LEVEL</Typography>
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
                                    sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: risk.barColor } }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Stat rows */}
                            {[
                                { icon: <TrendingUp sx={{ color: '#007DA3', fontSize: 20 }} />, label: 'Expected Returns', value: idea.expectedReturn || idea.expectedReturns || '—' },
                                { icon: <AccessTime sx={{ color: '#007DA3', fontSize: 20 }} />, label: 'Time Horizon', value: horizonLabel },
                                { icon: <Category sx={{ color: '#007DA3', fontSize: 20 }} />, label: 'Category', value: catLabel },
                                { icon: <CalendarToday sx={{ color: '#007DA3', fontSize: 20 }} />, label: 'Published', value: formatDate(idea.createdAt) },
                            ].map(({ icon, label, value }) => (
                                <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ mt: 0.1 }}>{icon}</Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                                            {label.toUpperCase()}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} sx={{ color: '#1a2332' }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}

                            <Divider sx={{ mb: 2 }} />

                            {/* Allocation bar */}
                            {idea.allocation && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>SUGGESTED ALLOCATION</Typography>
                                        <Typography variant="caption" fontWeight={800} color="primary">{idea.allocation}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate" value={idea.allocation}
                                        sx={{ height: 8, borderRadius: 4, bgcolor: '#e6f5fa', '& .MuiLinearProgress-bar': { bgcolor: '#007DA3' } }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        of total portfolio
                                    </Typography>
                                </Box>
                            )}

                            {/* Suitable For */}
                            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={0.5}>SUITABLE FOR</Typography>
                                <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                    {idea.suitableFor === 'all' ? 'All Investor Levels' : idea.suitableFor?.replace('_', ' ') || '—'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Related Ideas Card */}
                    {related.length > 0 && (
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={800} mb={2} sx={{ color: '#1a2332' }}>
                                    Related Ideas
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                                    sx={{ mt: 2, borderRadius: 2, fontWeight: 700 }}
                                >
                                    View All Ideas
                                </Button>
                            </CardContent>
                        </Card>
                    )}
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
