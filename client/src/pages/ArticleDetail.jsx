import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, Button, Divider, CircularProgress, Alert, Grid } from '@mui/material';
import { ArrowBack, CalendarToday, Person, Category, AccessTime } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/api';
import StructuredContent from '../components/StructuredContent';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [relatedIdeas, setRelatedIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const res = await getArticleById(id);
                if (res.data) {
                    setArticle(res.data.article || res.data);
                    setRelatedArticles(res.data.relatedArticles || []);
                    setRelatedIdeas(res.data.relatedIdeas || []);
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

        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(scroll);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
            {/* Reading Progress Bar */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', bgcolor: 'transparent', zIndex: 100 }}>
                <Box sx={{ width: `${scrollProgress * 100}%`, height: '100%', bgcolor: '#007DA3', transition: 'width 0.1s' }} />
            </Box>

            {/* Hero Image Section */}
            <Box 
                sx={{ 
                    height: { xs: '350px', md: '500px' }, 
                    width: '100%', 
                    position: 'relative',
                    backgroundImage: `url(${article.image || article.imageUrl || article.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop'})`,
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
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>{article.author || 'Investa Editorial'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CalendarToday sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
                                {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 12, 2026'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AccessTime sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>{article.readTime ? `${article.readTime} min read` : '12 min read'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Category sx={{ color: '#007DA3', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>{article.difficultyLevel || 'Beginner'}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 6 }} />

                    {/* Long Form Content Rendering */}
                    <StructuredContent content={article.fullContent || article.content} />

                    {/* Bottom Tags */}
                    <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid #F3F4F6', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {article.tags && article.tags.length > 0 ? (
                            article.tags.map(tag => (
                                <Chip key={tag} label={`#${tag.toUpperCase()}`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                            ))
                        ) : (
                            <>
                                <Chip label={`#${article.category}`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                                <Chip label={`#${article.riskLevel}Risk`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                            </>
                        )}
                    </Box>
                </Box>

                {/* Intelligent Recommendations */}
                {(relatedArticles.length > 0 || relatedIdeas.length > 0) && (
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#007DA3' }}>
                            Keep Learning: Recommended For You
                        </Typography>
                        <Grid container spacing={4}>
                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <Grid item xs={12} md={relatedIdeas.length > 0 ? 6 : 12}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Related Articles</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {relatedArticles.map(rel => (
                                            <Box 
                                                key={rel._id} 
                                                onClick={() => navigate(`/article/${rel._id}`)}
                                                sx={{ 
                                                    p: 3, bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#007DA3', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={800} color="#007DA3" mb={1}>{rel.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {rel.summary || rel.fullContent?.substring(0, 100) + '...'}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            )}

                            {/* Related Ideas */}
                            {relatedIdeas.length > 0 && (
                                <Grid item xs={12} md={relatedArticles.length > 0 ? 6 : 12}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Investment Strategies</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {relatedIdeas.map(idea => (
                                            <Box 
                                                key={idea._id} 
                                                onClick={() => navigate(`/idea/${idea._id}`)}
                                                sx={{ 
                                                    p: 3, bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                    '&:hover': { borderColor: '#10B981', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight={800} color="#10B981">{idea.title}</Typography>
                                                    <Chip label={idea.riskLevel} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {idea.description || idea.content?.substring(0, 100) + '...'}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}

                {/* Call to Action */}
                <Box 
                    sx={{ 
                        mt: 8, 
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
