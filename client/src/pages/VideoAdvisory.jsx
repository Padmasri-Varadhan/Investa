import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Dialog, DialogContent, IconButton, Stack, CircularProgress } from '@mui/material';
import { PlayCircle, Close, FilterList, Refresh } from '@mui/icons-material';
import { getVideos } from '../services/api';
import VideoCard from '../components/VideoCard';

const VideoAdvisory = () => {
    const [playing, setPlaying] = useState(null);
    const [tab, setTab] = useState('all');
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);

    const itemsPerPage = 6;

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const params = { page, limit: itemsPerPage };
                if (tab !== 'all') params.level = tab;
                
                const res = await getVideos(params);
                const incoming = res.data.data || [];
                if (page === 1) {
                    // Deduplicate on initial load by _id
                    const unique = Array.from(new Map(incoming.map(v => [v._id, v])).values());
                    setVideos(unique);
                } else {
                    setVideos(prev => {
                        const existingIds = new Set(prev.map(v => v._id));
                        const newItems = incoming.filter(v => !existingIds.has(v._id));
                        return [...prev, ...newItems];
                    });
                }
                setTotalPages(res.data.pagination?.pages || 1);
            } catch (err) {
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [page, tab]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const handleTabChange = (level) => {
        if (tab !== level) {
            setTab(level);
            setPage(1);
        }
    };

    return (
        <Box sx={{ maxWidth: '1600px', mx: 'auto', px: { xs: 2, md: 4 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 900,
                        color: '#007DA3',
                        mb: 1,
                        letterSpacing: -1,
                        fontSize: { xs: '1.75rem', md: '2.5rem' }
                    }}
                >
                    Video Advisory
                </Typography>
            </Box>

            {/* Level Controls */}
            <Box sx={{ mb: 6, display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                    <Button
                        key={level}
                        onClick={() => handleTabChange(level)}
                        sx={{
                            px: 3, py: 1,
                            borderRadius: '24px',
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: tab === level ? '#007DA3' : 'white',
                            color: tab === level ? 'white' : '#4B5563',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': { bgcolor: tab === level ? '#005b7a' : '#F9FAFB' }
                        }}
                    >
                        {level.toUpperCase()}
                    </Button>
                ))}
            </Box>

            {/* Video Grid */}
            {loading && page === 1 ? (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <CircularProgress sx={{ color: '#007DA3' }} />
                </Box>
            ) : videos.length > 0 ? (
                <Grid container spacing={4} justifyContent="flex-start">
                    {videos.map(video => (
                        <Grid item key={video._id || video.id} xs={12} sm={6} lg={6} xl={6} sx={{ display: 'flex' }}>
                            <VideoCard
                                video={video}
                                onPlay={(v) => {
                                    setPlaying(v);
                                    setVideoLoading(true);
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

            ) : (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <Typography variant="h5" sx={{ color: '#9CA3AF', fontWeight: 600 }}>No videos available in this category</Typography>
                </Box>
            )}

            {/* Load More Button */}
            {page < totalPages && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleLoadMore}
                        disabled={loading}
                        sx={{
                            bgcolor: 'white',
                            color: '#1F2937',
                            fontWeight: 800,
                            px: 4, py: 1.5,
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            '&:hover': { bgcolor: '#F9FAFB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                        }}
                    >
                        {loading ? 'Loading...' : 'Load More Content'}
                    </Button>
                </Stack>
            )}

            {/* Cinematic Video Player Modal */}
            <Dialog
                open={!!playing}
                onClose={() => setPlaying(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', bgcolor: 'black' } }}
            >
                {playing && (
                    <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black', overflow: 'hidden' }}>
                        <IconButton
                            onClick={() => setPlaying(null)}
                            sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                        >
                            <Close />
                        </IconButton>
                        <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#000', width: '100%' }}>
                            {videoLoading && (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, bgcolor: 'black' }}>
                                    <CircularProgress sx={{ color: '#007DA3' }} />
                                </Box>
                            )}
                            <iframe
                                width="100%"
                                height="100%"
                                src={`${playing.videoUrl.replace('youtube.com', 'youtube-nocookie.com')}?autoplay=1&rel=0&enablejsapi=1`}
                                title={playing.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                onLoad={() => setVideoLoading(false)}
                                onError={() => setVideoLoading(false)}
                                style={{ position: 'relative', zIndex: 1 }}
                            ></iframe>
                        </Box>
                        <Box sx={{ p: 4, bgcolor: '#1F2937' }}>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>{playing.title}</Typography>
                            <Typography variant="body1" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
                                ADVISOR: {playing.advisor || 'Investa Expert'} • {playing.duration} • {playing.level?.toUpperCase() || playing.riskLevel?.toUpperCase() || 'BEGINNER'} LEVEL
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 2, lineHeight: 1.6 }}>
                                {playing.description}
                            </Typography>
                        </Box>
                    </DialogContent>
                )}
            </Dialog>
        </Box>
    );
};

export default VideoAdvisory;
