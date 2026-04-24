import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { Shield, Warning, Bolt, ArrowForward, Verified } from '@mui/icons-material';

const pulseKeyframes = `
  @keyframes pulseMatch {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 125, 163, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 125, 163, 0); }
  }
`;

const riskConfig = {
    low:    { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', icon: <Shield />,  label: 'Low Risk',    gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
    medium: { color: '#d97706', bg: '#fef3c7', border: '#fcd34d', icon: <Warning />, label: 'Medium Risk', gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    high:   { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', icon: <Bolt />,    label: 'High Risk',   gradient: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
};

const categoryMeta = {
    index_fund:  { emoji: '📈', label: 'Index Fund' },
    etf:         { emoji: '🔗', label: 'ETF' },
    stocks:      { emoji: '📊', label: 'Stocks' },
    real_estate: { emoji: '🏘️', label: 'Real Estate' },
    bonds:       { emoji: '💵', label: 'Bonds' },
    crypto:      { emoji: '₿',  label: 'Crypto' },
    mutual_fund: { emoji: '💼', label: 'Mutual Fund' },
    general:     { emoji: '💡', label: 'General' },
};

const InvestmentCard = ({ 
    item, 
    onClick, 
    isBestMatch = false, 
    actionLabel = "Details",
    categoryOverride = null,
    riskOverride = null
}) => {
    const riskKey = (riskOverride || item.riskLevel || 'medium').toLowerCase();
    const risk = riskConfig[riskKey] || riskConfig.medium;
    
    // Support both direct category string and object
    const catId = categoryOverride || item.category || 'general';
    const cat = categoryMeta[catId] || { emoji: '💡', label: catId };
    
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            onClick={() => onClick && onClick(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                width: 340,
                height: 310,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: isBestMatch ? `2px solid #007DA3` : `1.5px solid ${hovered ? risk.border : 'transparent'}`,
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: hovered ? 'translateY(-6px)' : 'none',
                boxShadow: hovered ? '0 16px 32px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                m: 1.5,
            }}
        >
            <style>{pulseKeyframes}</style>

            {/* Match Badge */}
            {isBestMatch && (
                <Box
                    sx={{
                        position: 'absolute', top: 15, left: -40, bgcolor: '#007DA3', color: '#fff',
                        px: 5, py: 0.3, transform: 'rotate(-45deg)', zIndex: 10,
                        animation: 'pulseMatch 2s infinite',
                    }}
                >
                    <Typography variant="caption" fontWeight={900} sx={{ fontSize: 8 }}>MATCH</Typography>
                </Box>
            )}

            {/* Image Section */}
            <Box
                sx={{
                    height: 110,
                    background: (item.imageUrl || item.thumbnail)
                        ? `linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6)), url(${item.imageUrl || item.thumbnail}) center/cover no-repeat`
                        : risk.gradient,
                    position: 'relative',
                    flexShrink: 0,
                }}
            >
                <Box sx={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 1 }}>
                    <Chip
                        label={`${cat.emoji} ${cat.label}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800, backdropFilter: 'blur(10px)', fontSize: 10, height: 20 }}
                    />
                </Box>
                <Chip
                    icon={React.cloneElement(risk.icon, { fontSize: 'small', style: { color: risk.color } })}
                    label={risk.label}
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', color: risk.color, fontWeight: 800, fontSize: 10, height: 20 }}
                />
            </Box>

            {/* Body */}
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                        variant="subtitle1" fontWeight={900}
                        sx={{ color: '#1a2332', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                    >
                        {item.title}
                    </Typography>
                    {isBestMatch && <Verified sx={{ color: '#007DA3', fontSize: 16, ml: 1 }} />}
                </Box>

                <Typography
                    variant="caption" color="text.secondary"
                    sx={{
                        mb: 1.5, opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4
                    }}
                >
                    {item.description || item.summary || item.content?.slice(0, 100)}
                </Typography>

                {/* Metrics */}
                <Box
                    sx={{
                        bgcolor: '#f8fafc', borderRadius: 2, p: 1, mb: 1.5, border: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary', fontWeight: 700, display: 'block' }}>RETURNS</Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 900, color: 'primary.main' }}>
                            {item.expectedReturn || item.expectedReturns || '12-15%'}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary', fontWeight: 700, display: 'block' }}>HORIZON</Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 900 }}>
                            {item.timeHorizon || item.horizon || '3-5 Yrs'}
                        </Typography>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Chip label={risk.label} size="small" sx={{ fontSize: 9, height: 18, fontWeight: 700, bgcolor: risk.bg, color: risk.color }} />
                    <Button
                        size="small" endIcon={<ArrowForward sx={{ fontSize: 12 }} />}
                        onClick={(e) => { e.stopPropagation(); onClick && onClick(item); }}
                        sx={{ fontWeight: 800, textTransform: 'none', fontSize: 11, color: '#007DA3', p: 0 }}
                    >
                        {actionLabel}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default InvestmentCard;
