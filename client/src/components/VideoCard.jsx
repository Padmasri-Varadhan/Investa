import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { PlayArrow, ArrowForward } from '@mui/icons-material';

const VideoCard = ({ video, onPlay }) => {
    const [imgSrc, setImgSrc] = React.useState(video.thumbnail);
    const [fallbackStage, setFallbackStage] = React.useState(0);

    React.useEffect(() => {
        setImgSrc(video.thumbnail);
        setFallbackStage(0);
    }, [video.thumbnail]);

    const getFallbackImage = () => {
        const category = video.category?.toLowerCase() || 'finance';
        const fallbacks = {
            beginner: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800',
            intermediate: 'https://images.unsplash.com/photo-1611974714405-1a89c9704e67?q=80&w=800',
            advanced: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
            finance: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=800'
        };
        return fallbacks[category] || fallbacks.finance;
    };

    const handleImageError = () => {
        const idMatch = video.thumbnail.match(/\/vi\/([^/]+)/);
        const id = idMatch ? idMatch[1] : null;
        if (!id) return;

        const stages = [
            `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
            `https://i.ytimg.com/vi/${id}/0.jpg`,
            getFallbackImage()
        ];

        if (fallbackStage < stages.length) {
            setImgSrc(stages[fallbackStage]);
            setFallbackStage(prev => prev + 1);
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    '& .play-overlay': { opacity: 1 }
                }
            }}
        >
            <Box 
                sx={{ 
                    position: 'relative', 
                    aspectRatio: '16/9', 
                    minHeight: '180px', 
                    width: '100%', 
                    cursor: 'pointer',
                    bgcolor: '#E5E7EB', // Base gray
                    background: 'linear-gradient(135deg, #007DA3 0%, #004e66 100%)', // Finance gradient
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} 
                onClick={() => onPlay && onPlay(video)}
            >
                {/* Fallback Icon (Visible if image fails or is transparent) */}
                <PlayArrow sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 60, position: 'absolute' }} />
                
                <CardMedia
                    component="img"
                    sx={{ 
                        height: '100%', 
                        width: '100%', 
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 1,
                        display: imgSrc ? 'block' : 'none'
                    }}
                    src={imgSrc}
                    alt={video.title}
                    onError={handleImageError}
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
                    <Box sx={{ 
                        bgcolor: (video.level === 'advanced' || video.riskLevel === 'High') ? '#FEE2E2' : '#FEF3C7', 
                        color: (video.level === 'advanced' || video.riskLevel === 'High') ? '#DC2626' : '#B45309', 
                        px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 
                    }}>
                        {(video.level || video.riskLevel || 'beginner').toUpperCase()} {video.level ? 'LEVEL' : 'RISK'}
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
