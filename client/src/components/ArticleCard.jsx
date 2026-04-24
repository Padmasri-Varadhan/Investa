import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const ArticleCard = ({ article, onClick }) => {
    return (
        <Card
            onClick={() => onClick && onClick(article)}
            sx={{
                height: '100%',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }
            }}
        >
            <Box sx={{ position: 'relative', height: 176 }}>
                <CardMedia
                    component="img"
                    sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    image={article.imageUrl || 'https://via.placeholder.com/400x200?text=Investa+News'}
                    alt={article.title}
                />
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: '#007DA3', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {article.category?.toUpperCase() || 'STOCKS'}
                    </Box>
                    <Box sx={{ bgcolor: article.riskLevel === 'High' ? '#FEE2E2' : '#ECFDF5', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: article.riskLevel === 'High' ? '#DC2626' : '#059669', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {article.riskLevel?.toUpperCase() || 'MEDIUM RISK'}
                    </Box>
                </Box>
            </Box>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#111827', 
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8rem',
                        mb: 1
                    }}
                >
                    {article.title}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#6B7280',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6rem',
                        mb: 2,
                        lineHeight: 1.5
                    }}
                >
                    {article.summary || article.content?.slice(0, 100) + '...'}
                </Typography>

                {/* Meta Info Row */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, fontSize: '0.65rem' }}>
                            {article.author || 'Investa Team'} • {new Date(article.createdAt).toLocaleDateString() || 'Oct 24, 2023'}
                        </Typography>
                    </Box>
                </Box>

                {/* Data Box */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#F8FAFC', borderRadius: '16px', p: 2, mb: 2, border: '1px solid #F1F5F9' }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, fontSize: '0.6rem', display: 'block', mb: 0.5 }}>EXPECTED RETURNS</Typography>
                        <Typography variant="body2" sx={{ color: '#007DA3', fontWeight: 800 }}>{article.expectedReturns || '12-15%'}</Typography>
                    </Box>
                    <Box sx={{ width: '1px', bgcolor: '#E2E8F0', mx: 2 }} />
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, fontSize: '0.6rem', display: 'block', mb: 0.5 }}>TIME HORIZON</Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B', fontWeight: 800 }}>{article.horizon || '3-5 Yrs'}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            READ TIME: {article.readTime || '5'} MIN
                        </Typography>
                    </Box>
                    <Button 
                        size="small" 
                        endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />} 
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 800,
                            color: '#007DA3',
                            p: 0,
                            '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                        }}
                    >
                        Read More
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ArticleCard;
