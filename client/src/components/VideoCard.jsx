import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Stack } from '@mui/material';
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
        const idMatch = video.thumbnail?.match(/\/vi\/([^/]+)/);
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

    const getLevelColors = (level) => {
        const lvl = level?.toLowerCase();
        if (lvl === 'advanced') {
            return { bg: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.25)' };
        } else if (lvl === 'intermediate') {
            return { bg: 'rgba(245, 158, 11, 0.05)', color: '#D97706', border: '1px solid rgba(245, 158, 11, 0.25)' };
        } else {
            return { bg: 'rgba(16, 185, 129, 0.05)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' };
        }
    };

    const getAdvisorBadge = (advisor) => {
        const isZerodha = advisor?.toLowerCase().includes('zerodha');
        return (
            <Box sx={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                background: isZerodha ? 'linear-gradient(135deg, #ED5F35, #F13B35)' : 'linear-gradient(135deg, #10B981, #007DA3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 900,
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.1)',
                border: '1.5px solid white'
            }}>
                {isZerodha ? 'ZV' : 'IM'}
            </Box>
        );
    };

    const lvlColors = getLevelColors(video.level);

    return (
        <Card
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: '20px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 15px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 30px -8px rgba(15, 23, 42, 0.06), 0 10px 15px -5px rgba(15, 23, 42, 0.03)',
                    borderColor: 'rgba(0, 125, 163, 0.2)',
                    '& .play-overlay': { opacity: 1 },
                    '& .card-thumbnail': { transform: 'scale(1.04)' }
                }
            }}
        >
            {/* Thumbnail Wrapper */}
            <Box 
                sx={{ 
                    position: 'relative', 
                    aspectRatio: '16/9', 
                    width: '100%', 
                    cursor: 'pointer',
                    bgcolor: '#F1F5F9',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} 
                onClick={() => onPlay && onPlay(video)}
            >
                <CardMedia
                    className="card-thumbnail"
                    component="img"
                    sx={{ 
                        height: '100%', 
                        width: '100%', 
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'transform 0.4s ease'
                    }}
                    src={imgSrc}
                    alt={video.title}
                    onError={handleImageError}
                />
                
                {/* Duration Badge */}
                <Box sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.75)', px: 1, py: 0.3, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'white', backdropFilter: 'blur(4px)' }}>
                        {video.duration || '00:00'}
                    </Box>
                </Box>



                {/* Hover Play Button Overlay */}
                <Box 
                    className="play-overlay"
                    sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(15, 23, 42, 0.25)',
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        zIndex: 3
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
                        boxShadow: '0 10px 20px -3px rgba(15, 23, 42, 0.25)',
                        transform: 'scale(1)',
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': { transform: 'scale(1.12)' }
                    }}>
                        <PlayArrow sx={{ color: '#007DA3', fontSize: 28 }} />
                    </Box>
                </Box>
            </Box>

            {/* Card Info Content */}
            <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        fontWeight: 800, 
                        color: '#0F172A', 
                        mb: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.5rem',
                        lineHeight: 1.3,
                        fontSize: '0.975rem',
                        letterSpacing: '-0.01em'
                    }}
                >
                    {video.title}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#64748B', 
                        fontSize: '0.825rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.4rem',
                        lineHeight: 1.45,
                        mb: 2.5
                    }}
                >
                    {video.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid rgba(241, 245, 249, 0.8)' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {getAdvisorBadge(video.advisor)}
                        <Stack spacing={0}>
                            <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.725rem' }}>
                                {video.advisor || 'Investa Advisor'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.65rem' }}>
                                {video.views || '10K'} VIEWS
                            </Typography>
                        </Stack>
                    </Stack>
                    
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ 
                            bgcolor: lvlColors.bg, 
                            color: lvlColors.color, 
                            border: lvlColors.border,
                            px: 1.2, py: 0.4, borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800 
                        }}>
                            {(video.level || 'beginner').toUpperCase()}
                        </Box>
                        
                        <Button 
                            size="small" 
                            endIcon={<ArrowForward sx={{ fontSize: '14px !important' }} />} 
                            sx={{ 
                                textTransform: 'none', 
                                fontWeight: 800,
                                fontSize: '0.775rem',
                                color: '#007DA3',
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                            }}
                            onClick={() => onPlay && onPlay(video)}
                        >
                            Watch
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
