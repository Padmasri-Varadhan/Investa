import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Button, Grid } from '@mui/material';
import { Shield, Warning, Bolt, ArrowForward, Verified } from '@mui/icons-material';

const pulseKeyframes = `
  @keyframes pulseMatch {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 125, 163, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0); }
  }
`;

const riskConfig = {
    low: { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', icon: <Shield />, label: 'Low Risk', gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
    medium: { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', icon: <Warning />, label: 'Medium Risk', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    high: { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', icon: <Bolt />, label: 'High Risk', gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
};

const categoryMeta = {
    index_fund: { emoji: '📈', label: 'Index Fund' },
    etf: { emoji: '🔗', label: 'ETF' },
    stocks: { emoji: '📊', label: 'Stocks' },
    real_estate: { emoji: '🏘️', label: 'Real Estate' },
    bonds: { emoji: '💵', label: 'Bonds' },
    crypto: { emoji: '₿', label: 'Crypto' },
    mutual_fund: { emoji: '💼', label: 'Mutual Fund' },
    savings_account: { emoji: '🏦', label: 'Savings Account' },
    fixed_deposit: { emoji: '🔒', label: 'Fixed Deposit' },
    recurring_deposit: { emoji: '📅', label: 'Recurring Deposit' },
    ppf: { emoji: '🛡️', label: 'PPF' },
    epf: { emoji: '👴', label: 'EPF' },
    nps: { emoji: '👵', label: 'NPS' },
    gold_investment: { emoji: '🪙', label: 'Gold Investment' },
    government_schemes: { emoji: '🏛️', label: 'Govt Schemes' },
    corporate_bonds: { emoji: '🏢', label: 'Corporate Bonds' },
    treasury_bills: { emoji: '📜', label: 'Treasury Bills' },
    reits: { emoji: '🏢', label: 'REITs' },
    international_investments: { emoji: '🌎', label: 'Global' },
    general: { emoji: '💡', label: 'General' },
};

const InvestmentCard = ({
    item,
    onClick,
    isBestMatch = false,
    actionLabel = "View Details →",
    categoryOverride = null,
    riskOverride = null,
    showRiskTag = true
}) => {
    const riskKey = (riskOverride || item.riskLevel || 'medium').toLowerCase();
    const risk = riskConfig[riskKey] || riskConfig.medium;

    const catId = categoryOverride || item.category || 'general';
    const cat = categoryMeta[catId] || { emoji: '💡', label: catId };

    const [hovered, setHovered] = useState(false);

    // Clean title function
    const displayTitle = React.useMemo(() => {
        if (!item.title) return '';
        let cleaned = item.title.replace(/Alpha Strategy #\d+:\s*/i, '');
        
        // Mapping for specific cleaner names
        const mapping = {
            'etf': 'Technology Sector ETF',
            'stocks': 'Dividend Growth Stocks',
            'bonds': 'Government Bond Strategy',
            'crypto': 'Crypto Starter Portfolio',
            'real_estate': 'REIT Income Plan'
        };
        
        // If the title is just a category or generic, replace it
        if (cleaned.length < 5 || cleaned.toUpperCase() === item.category?.toUpperCase()) {
            return mapping[item.category] || cleaned;
        }
        return cleaned;
    }, [item.title, item.category]);

    return (
        <Card
            onClick={() => onClick && onClick(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                width: '100%',
                height: 440,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                bgcolor: '#fff',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                transform: hovered ? 'scale(1.02)' : 'none',
                boxShadow: hovered ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                p: 0,
            }}
        >
            <style>{pulseKeyframes}</style>

            {/* Image Section */}
            <Box
                sx={{
                    height: 160,
                    background: (item.imageUrl || item.thumbnail)
                        ? `url(${item.imageUrl || item.thumbnail}) center/cover no-repeat`
                        : risk.gradient,
                    position: 'relative',
                    flexShrink: 0,
                    borderRadius: '24px 24px 0 0',
                }}
            >
                {/* Category Badge Top-Left */}
                <Box sx={{ position: 'absolute', top: 15, left: 15 }}>
                    <Chip
                        label={cat.label}
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.9)', 
                            color: '#1a2332', 
                            fontWeight: 800, 
                            fontSize: 10, 
                            height: 22,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '& .MuiChip-label': { px: 1 }
                        }}
                    />
                </Box>
                
                {isBestMatch && (
                    <Box
                        sx={{
                            position: 'absolute', top: 15, right: 15, bgcolor: '#007DA3', color: '#fff',
                            borderRadius: '12px', px: 1.5, py: 0.5, zIndex: 10,
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            boxShadow: '0 4px 10px rgba(0, 125, 163, 0.3)',
                            animation: 'pulseMatch 2s infinite',
                        }}
                    >
                        <Verified sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={900}>MATCH</Typography>
                    </Box>
                )}
            </Box>

            {/* Body */}
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                <Typography
                    variant="h6" fontWeight={800}
                    sx={{ color: '#1a2332', lineHeight: 1.2, mb: 1, fontSize: '1.1rem' }}
                >
                    {displayTitle}
                </Typography>

                <Typography
                    variant="body2" color="text.secondary"
                    sx={{
                        mb: 2.5, display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
                        fontSize: '0.875rem'
                    }}
                >
                    {item.description || item.summary || item.content?.slice(0, 100)}
                </Typography>

                {/* Metrics */}
                <Grid container spacing={2} sx={{ mb: 'auto' }}>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Returns</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#007DA3' }}>
                            {item.expectedReturn || item.expectedReturns || '12-15%'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Horizon</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            {item.timeHorizon || item.horizon || '3-5 Yrs'}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                        label={risk.label} 
                        size="small" 
                        sx={{ 
                            fontSize: 10, 
                            height: 24, 
                            fontWeight: 700, 
                            bgcolor: risk.bg, 
                            color: risk.color,
                            px: 1
                        }} 
                    />
                    <Button
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onClick && onClick(item); }}
                        sx={{ 
                            fontWeight: 800, 
                            textTransform: 'none', 
                            fontSize: '0.875rem', 
                            color: '#007DA3',
                            '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                        }}
                    >
                        {actionLabel}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default InvestmentCard;
