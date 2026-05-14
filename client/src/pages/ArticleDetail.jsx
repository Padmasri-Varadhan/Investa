import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, Button, Divider, CircularProgress, Alert } from '@mui/material';
import { ArrowBack, CalendarToday, Person, Category, AccessTime } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/api';
import StructuredContent from '../components/StructuredContent';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const res = await getArticleById(id);
                if (res.data) {
                    setArticle(res.data.article || res.data);
                } else {
                    setError('Article not found.');
                }
            } catch (err) {
                console.error("Error fetching article:", err);
                setError('Failed to load article.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#007DA3' }} />
            </Box>
        );
    }

    if (error || !article) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error">{error || 'Article not found'}</Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/articles')} sx={{ mt: 2 }}>
                    Back to Articles
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pb: 8 }}>
            {/* Hero Image Section */}
            <Box 
                sx={{ 
                    height: { xs: '350px', md: '500px' }, 
                    width: '100%', 
                    position: 'relative',
                    backgroundImage: `url(${article.image || article.imageUrl || article.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mb: 4, // Added margin bottom instead of negative margin on container
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.5)' // Slightly darker overlay for better text contrast
                    }
                }}
            >
                <Container sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 6 }}>
                    <Button 
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate('/articles')}
                        sx={{ position: 'absolute', top: 32, left: 24, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                    >
                        Back to Insights
                    </Button>
                    <Box sx={{ maxWidth: '800px', mt: 8 }}>
                        <Chip 
                            label={article.category?.toUpperCase()} 
                            sx={{ bgcolor: '#007DA3', color: 'white', fontWeight: 800, mb: 3, px: 1 }} 
                        />
                        <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2.25rem', md: '3.75rem' }, lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            {article.title}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md">
                <Box sx={{ bgcolor: 'white', borderRadius: '24px', p: { xs: 4, md: 8 }, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    {/* Meta Info */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Person sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>Investa Editorial</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CalendarToday sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
                                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 12, 2024'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AccessTime sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>{article.readTime || '12 min read'}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 6 }} />

                    {/* Long Form Content Rendering */}
                    <StructuredContent content={article.fullContent || article.content} />

                    {/* Bottom Tags */}
                    <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid #F3F4F6', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Chip label={`#${article.category}`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                        <Chip label={`#${article.riskLevel}Risk`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                        <Chip label="#Investing" variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                        <Chip label="#WealthManagement" variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                    </Box>
                </Box>

                {/* Call to Action */}
                <Box 
                    sx={{ 
                        mt: 6, 
                        background: 'linear-gradient(135deg, #007DA3 0%, #005b7a 100%)', 
                        borderRadius: '24px', 
                        p: { xs: 4, md: 6 }, 
                        color: 'white', 
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 125, 163, 0.2)'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Interested in {article.category}?</Typography>
                    <Typography sx={{ mb: 4, fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                        Our expert advisors can help you build a personalized strategy based on the insights in this article.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/video-advisory')}
                        sx={{ 
                            bgcolor: 'white', 
                            color: '#007DA3', 
                            fontWeight: 900, 
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            '&:hover': { bgcolor: '#F3F4F6', transform: 'scale(1.02)' },
                            transition: 'all 0.2s'
                        }}
                    >
                        Schedule Free Advisory Call
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ArticleDetail;
