import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { PlayArrow, ArrowForward } from '@mui/icons-material';

const VideoCard = ({ video, onPlay }) => {
    return (
        <Card
            sx={{
                height: '100%',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    '& .play-overlay': { opacity: 1 }
                }
            }}
        >
            <Box sx={{ position: 'relative', height: 176, width: '100%', cursor: 'pointer' }} onClick={() => onPlay && onPlay(video)}>
                <CardMedia
                    component="img"
                    sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    image={video.thumbnail}
                    alt={video.title}
                />
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.95)', px: 1.5, py: 0.5, borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: '#007DA3', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {video.category?.toUpperCase() || 'ADVISORY'}
                    </Box>
                </Box>
                <Box sx={{ position: 'absolute', bottom: 12, right: 12 }}>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.7)', px: 1.2, py: 0.4, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'white', backdropFilter: 'blur(4px)' }}>
                        {video.duration || '12:45'}
                    </Box>
                </Box>
                <Box 
                    className="play-overlay"
                    sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        opacity: 0,
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Box sx={{ 
                        bgcolor: 'white', 
                        borderRadius: '50%', 
                        width: 52, 
                        height: 52, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                    }}>
                        <PlayArrow sx={{ color: '#007DA3', fontSize: 28 }} />
                    </Box>
                </Box>
            </Box>
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#111827', 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.8rem',
                        lineHeight: 1.4
                    }}
                >
                    {video.title}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#6B7280', 
                        fontSize: '0.875rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6rem',
                        lineHeight: 1.5
                    }}
                >
                    {video.description || `${video.advisor} • Expert Advisory`}
                </Typography>

                {/* Meta Info Row */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 700, fontSize: '0.65rem' }}>
                        {video.advisor || 'Expert Advisor'} • {video.views || '12K'} VIEWS
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                    <Box sx={{ bgcolor: video.riskLevel === 'High' ? '#FEE2E2' : '#FEF3C7', color: video.riskLevel === 'High' ? '#DC2626' : '#B45309', px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                        {video.riskLevel?.toUpperCase() || 'MODERATE'} RISK
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
                        onClick={() => onPlay && onPlay(video)}
                    >
                        Watch
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
