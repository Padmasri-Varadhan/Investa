import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Grid, 
    Typography, 
    Button, 
    Dialog, 
    DialogContent, 
    IconButton, 
    Stack, 
    CircularProgress,
    TextField,
    InputAdornment
} from '@mui/material';
import { Close, Search, Clear } from '@mui/icons-material';
import { getVideos } from '../services/api';
import VideoCard from '../components/VideoCard';

const VideoAdvisory = () => {
    const [playing, setPlaying] = useState(null);
    const [tab] = useState('all');
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const itemsPerPage = 6;



    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1); // Reset page on search change
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const params = { page, limit: itemsPerPage };
                if (search.trim()) {
                    params.search = search.trim();
                }
                
                if (tab !== 'all') {
                    const categoryMap = {
                        'investing': 'Investing',
                        'planning': 'Planning',
                        'alternative_assets': 'Alternative Assets'
                    };
                    params.category = categoryMap[tab] || tab;
                }
                
                const res = await getVideos(params);
                const incoming = res.data.data || [];
                if (page === 1) {
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
    }, [page, tab, search]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };



    const handleClearSearch = () => {
        setSearchInput('');
    };

    return (
        <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 2.5, md: 5 }, py: 6, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
            {/* Header Section */}
            <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                spacing={3} 
                sx={{ mb: 5 }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            color: '#007DA3',
                            letterSpacing: '-0.025em',
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Video Advisory
                    </Typography>
                </Box>

                {/* Modern Search Bar */}
                <TextField
                    placeholder="Search by title, topic or creator..."
                    variant="outlined"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{
                        width: { xs: '100%', md: '400px' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            bgcolor: 'white',
                            '& fieldset': { borderColor: '#E2E8F0', borderWidth: '1.5px' },
                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                            '&.Mui-focused fieldset': { borderColor: '#007DA3', borderWidth: '2px' }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#94A3B8' }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchInput && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearch} size="small" edge="end">
                                    <Clear sx={{ color: '#94A3B8' }} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Stack>



            {/* Video Grid Layout */}
            {loading && page === 1 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 15 }}>
                    <CircularProgress sx={{ color: '#007DA3' }} />
                </Box>
            ) : videos.length > 0 ? (
                <Grid container spacing={3.5} justifyContent="flex-start">
                    {videos.map(video => (
                        <Grid item key={video._id || video.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
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
                <Box sx={{ textAlign: 'center', py: 15, bgcolor: 'white', borderRadius: '24px', border: '1px dashed #E2E8F0' }}>
                    <Typography variant="h6" sx={{ color: '#475569', fontWeight: 700, mb: 1 }}>No videos found</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>Try adjusting your keywords or filters to explore other categories.</Typography>
                </Box>
            )}

            {/* Load More Trigger */}
            {page < totalPages && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleLoadMore}
                        disabled={loading}
                        sx={{
                            bgcolor: 'white',
                            color: '#334155',
                            fontWeight: 700,
                            px: 5, py: 1.5,
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0',
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            '&:hover': { bgcolor: '#F8FAFC', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)' }
                        }}
                    >
                        {loading ? 'Loading content...' : 'Load More Videos'}
                    </Button>
                </Stack>
            )}

            {/* Cinematic Video Player Modal */}
            <Dialog
                open={!!playing}
                onClose={() => setPlaying(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: '28px', overflow: 'hidden', bgcolor: '#000' } }}
            >
                {playing && (
                    <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#000', overflow: 'hidden' }}>
                        <IconButton
                            onClick={() => setPlaying(null)}
                            sx={{ 
                                position: 'absolute', 
                                top: 20, 
                                right: 20, 
                                zIndex: 10, 
                                color: 'white', 
                                bgcolor: 'rgba(15, 23, 42, 0.6)', 
                                backdropFilter: 'blur(8px)', 
                                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.9)' } 
                            }}
                        >
                            <Close />
                        </IconButton>
                        <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: '#000', width: '100%' }}>
                            {videoLoading && (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, bgcolor: '#000' }}>
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
                        <Box sx={{ p: 4.5, bgcolor: '#0F172A' }}>
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1.5, fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
                                {playing.title}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>
                                    {playing.advisor}
                                </Box>
                                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
                                    {playing.duration} • {playing.views} Views
                                </Typography>
                                <Box sx={{ bgcolor: '#007DA3', px: 2, py: 0.5, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>
                                    {playing.level?.toUpperCase()}
                                </Box>
                            </Stack>
                            <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem' }}>
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
