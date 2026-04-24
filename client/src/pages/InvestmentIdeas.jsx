import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Chip,
    CircularProgress, Alert, Button, LinearProgress,
    Skeleton, Tooltip, Divider,
} from '@mui/material';
import {
    TrendingUp, Shield, Warning, Bolt, ArrowForward, SearchOff,
    FilterList, Lightbulb, AutoGraph, Style,
    Star, WorkspacePremium, Verified, Timer,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInvestmentIdeas } from '../services/api';
import InvestmentCard from '../components/InvestmentCard';

/**
 * Investment Ideas Page - Premium Enhanced Version
 */

// ─── Keyframe Animations ─────────────────────────────────────────────────────
const pulseKeyframes = `
  @keyframes pulseMatch {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 125, 163, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0); }
  }
  @keyframes shimer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// ─── Config ──────────────────────────────────────────────────────────────────
const riskConfig = {
    low:    { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', icon: <Shield />,  label: 'Low Risk',    gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', profile: 'Conservative' },
    medium: { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', icon: <Warning />, label: 'Medium Risk', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)', profile: 'Moderate' },
    high:   { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', icon: <Bolt />,    label: 'High Risk',   gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)', profile: 'Aggressive' },
};

const categoryMeta = {
    index_fund:  { emoji: '📈', label: 'Index Fund',   color: '#7c3aed', bg: '#ede9fe' },
    etf:         { emoji: '🔗', label: 'ETF',          color: '#0369a1', bg: '#e0f2fe' },
    stocks:      { emoji: '📊', label: 'Stocks',       color: '#0f766e', bg: '#ccfbf1' },
    real_estate: { emoji: '🏘️', label: 'Real Estate',  color: '#b45309', bg: '#fef3c7' },
    bonds:       { emoji: '💵', label: 'Bonds',        color: '#6d28d9', bg: '#ede9fe' },
    crypto:      { emoji: '₿',  label: 'Crypto',       color: '#dc2626', bg: '#fee2e2' },
    mutual_fund: { emoji: '💼', label: 'Mutual Fund',  color: '#0284c7', bg: '#e0f2fe' },
};

const RISK_TABS = [
    { value: 'all',    label: 'All Strategies', icon: <Lightbulb fontSize="small" />,  active: '#007DA3', activeBg: '#e6f5fa' },
    { value: 'low',    label: 'Low Risk',       icon: <Shield fontSize="small" />,     active: '#059669', activeBg: '#d1fae5' },
    { value: 'medium', label: 'Medium Risk',    icon: <Warning fontSize="small" />,    active: '#d97706', activeBg: '#fef3c7' },
    { value: 'high',   label: 'High Risk',      icon: <Bolt fontSize="small" />,       active: '#dc2626', activeBg: '#fee2e2' },
];

// ─── Components ─────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <Card sx={{ width: 340, height: 310, borderRadius: 4, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', m: 1.5 }}>
            <Skeleton variant="rectangular" height={110} />
            <CardContent sx={{ p: 2, flex: 1 }}>
                <Skeleton variant="text" height={24} width="80%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={16} width="100%" sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 2, mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                    <Skeleton variant="rectangular" width={60} height={18} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width={50} height={18} />
                </Box>
            </CardContent>
        </Card>
    );
}


function IdeaCard({ idea, onNavigate, isBestMatch }) {
    return (
        <InvestmentCard 
            item={idea} 
            onClick={() => onNavigate(idea._id)} 
            isBestMatch={isBestMatch} 
        />
    );
}

function StatCard({ icon, label, value, color, active, bg, onClick }) {
    return (
        <Card
            onClick={onClick}
            sx={{
                textAlign: 'center',
                borderRadius: 4,
                cursor: 'pointer',
                border: active ? `2.5px solid ${color}` : '2.5px solid transparent',
                bgcolor: active ? bg : 'background.paper',
                boxShadow: active ? `0 12px 24px ${color}20` : '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'scale(1.02)', boxShadow: `0 12px 32px ${color}15` },
            }}
        >
            <CardContent sx={{ py: 3 }}>
                <Typography sx={{ fontSize: 32, mb: 0.5 }}>{icon}</Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color, lineHeight: 1 }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────

function InvestmentIdeas({ user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const urlSearchParam = queryParams.get('search') || '';

    const [ideas, setIdeas]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [tab, setTab]         = useState('all');

    const fetchIdeas = useCallback(async () => {
        try {
            const res = await getInvestmentIdeas();
            setIdeas(res.data);
        } catch {
            setError('Failed to load investment ideas. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIdeas();
        const interval = setInterval(fetchIdeas, 30000);
        return () => clearInterval(interval);
    }, [fetchIdeas]);

    // Filtering logic
    const activeSearch = urlSearchParam;
    const filtered = useMemo(() => {
        let result = tab === 'all' ? ideas : ideas.filter(i => i.riskLevel === tab);
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            result = result.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.description?.toLowerCase().includes(q) ||
                i.tags?.some(t => t.toLowerCase().includes(q))
            );
        }
        return result;
    }, [ideas, tab, activeSearch]);

    // Personalization
    const bestMatchId = useMemo(() => {
        if (!user || !ideas.length) return null;
        const matchingLevel = Object.keys(riskConfig).find(level => riskConfig[level].profile === user.riskProfile);
        const match = ideas.find(i => i.riskLevel === matchingLevel);
        return match ? match._id : null;
    }, [user, ideas]);

    const stats = {
        total:  ideas.length,
        low:    ideas.filter(i => i.riskLevel === 'low').length,
        medium: ideas.filter(i => i.riskLevel === 'medium').length,
        high:   ideas.filter(i => i.riskLevel === 'high').length,
    };

    return (
        <Box className="fade-in" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto', pb: 6 }}>
            <PageHeader 
                title="Investment Ideas" 
                subtitle="Curated high-performance strategies filtered for your lifestyle and risk tolerance."
                icon={<Lightbulb />}
            />

            {/* Quick Stats / Filter Cards */}
            <Grid container spacing={2} mb={5}>
                {[
                    { label: 'All Ideas',  id: 'all',    icon: '🚀', value: stats.total,  color: '#007DA3', bg: '#e6f5fa' },
                    { label: 'Safe Haven', id: 'low',    icon: '🛡️', value: stats.low,    color: '#059669', bg: '#d1fae5' },
                    { label: 'Balanced',   id: 'medium', icon: '⚖️', value: stats.medium, color: '#d97706', bg: '#fef3c7' },
                    { label: 'High Yield', id: 'high',   icon: '🔥', value: stats.high,   color: '#dc2626', bg: '#fee2e2' },
                ].map(s => (
                    <Grid item xs={6} sm={3} key={s.id}>
                        <StatCard
                            {...s}
                            active={tab === s.id}
                            onClick={() => setTab(s.id)}
                            value={loading ? '—' : s.value}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Sub-header Filter */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList sx={{ color: '#64748b' }} />
                    <Typography variant="subtitle2" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        Discovery Feed ({filtered.length})
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {RISK_TABS.map(t => (
                        <Chip
                            key={t.value}
                            label={t.label}
                            onClick={() => setTab(t.value)}
                            sx={{
                                fontWeight: 800,
                                fontSize: 12,
                                height: 32,
                                bgcolor: tab === t.value ? t.activeBg : 'transparent',
                                color: tab === t.value ? t.active : 'text.secondary',
                                border: `1.5px solid ${tab === t.value ? t.active : '#e2e8f0'}`,
                                '&:hover': { bgcolor: t.activeBg, borderColor: t.active, color: t.active },
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                </Box>
            </Box>
            {/* Content Display */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)
                ) : error ? (
                    <Alert severity="warning" variant="filled" sx={{ borderRadius: 3, fontWeight: 700, width: '100%', mb: 4 }}>
                        {error}
                    </Alert>
                ) : filtered.length === 0 ? (
                    <Box textAlign="center" py={10} sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '2px dashed #e2e8f0', width: '100%' }}>
                        <SearchOff sx={{ fontSize: 60, color: '#64748b', opacity: 0.3, mb: 2 }} />
                        <Typography variant="h6" fontWeight={900} color="text.secondary">No matching strategies found</Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>Try adjusting your filters or search terms.</Typography>
                        <Button
                            variant="contained"
                            onClick={() => { setTab('all'); window.history.replaceState({}, '', '/investment-ideas'); window.location.reload(); }}
                            sx={{ borderRadius: 2, fontWeight: 800, px: 4 }}
                        >
                            Reset All Filters
                        </Button>
                    </Box>
                ) : (
                    filtered.map((idea) => (
                        <IdeaCard
                            key={idea._id}
                            idea={idea}
                            onNavigate={(id) => navigate(`/idea/${id}`)}
                            isBestMatch={idea._id === bestMatchId}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

export default InvestmentIdeas;
