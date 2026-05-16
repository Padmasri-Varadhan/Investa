import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment, Chip, Pagination, Autocomplete } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../services/api';
import InvestmentCard from '../components/InvestmentCard';

const Articles = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [tab, setTab] = useState(() => sessionStorage.getItem('investaArticleCategory') || 'All');
    const [search, setSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState(() => sessionStorage.getItem('investaArticleDifficulty') || 'All');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params = {
                    page,
                    limit: itemsPerPage,
                };
                if (tab !== 'All') params.category = tab;
                if (search) params.search = search;
                if (difficultyFilter !== 'All') params.difficulty = difficultyFilter;
                
                const res = await getArticles(params);
                setArticles(res.data.data || []);
                setTotalPages(res.data.pagination?.pages || 1);
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [page, tab, search, difficultyFilter]);

    // Reset page when filter/search changes
    useEffect(() => {
        setPage(1);
    }, [tab, search, difficultyFilter]);



    const categoryOptions = [
        { label: 'All Categories', value: 'All', icon: '🌐' },
        { label: 'Stock Market Basics', value: 'Stock Market Basics', icon: '📈' },
        { label: 'Mutual Funds', value: 'Mutual Funds', icon: '💼' },
        { label: 'SIP Investments', value: 'SIP Investments', icon: '🔄' },
        { label: 'Real Estate', value: 'Real Estate', icon: '🏘️' },
        { label: 'Cryptocurrency', value: 'Cryptocurrency', icon: '₿' },
        { label: 'Gold Investment', value: 'Gold Investment', icon: '🥇' },
        { label: 'Personal Finance', value: 'Personal Finance', icon: '💳' },
        { label: 'Budgeting', value: 'Budgeting', icon: '📊' },
        { label: 'Retirement Planning', value: 'Retirement Planning', icon: '🌴' },
        { label: 'Tax Saving', value: 'Tax Saving', icon: '📑' },
        { label: 'Wealth Building', value: 'Wealth Building', icon: '🏰' },
        { label: 'Trading Basics', value: 'Trading Basics', icon: '⚡' },
        { label: 'Fundamental Analysis', value: 'Fundamental Analysis', icon: '🔍' },
        { label: 'Technical Analysis', value: 'Technical Analysis', icon: '📉' },
        { label: 'Risk Management', value: 'Risk Management', icon: '🛡️' },
        { label: 'Passive Income', value: 'Passive Income', icon: '🛋️' },
        { label: 'ETFs and Index Funds', value: 'ETFs and Index Funds', icon: '🔗' },
        { label: 'Bonds and Government Securities', value: 'Bonds and Government Securities', icon: '🏛️' },
        { label: 'International Investing', value: 'International Investing', icon: '🌍' },
        { label: 'Financial Planning', value: 'Financial Planning', icon: '🎯' }
    ];

    return (
        <Box className="fade-in" sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    color: '#007DA3', 
                    mb: 2, 
                    letterSpacing: '-0.5px' 
                }}
            >
                Investment Insights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 800 }}>
                Master your financial future with 200+ expert articles ranging from beginner basics to advanced strategies.
            </Typography>

            {/* Sticky Filter and Search Bar */}
            <Box 
                sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 10, 
                    bgcolor: 'rgba(249, 250, 251, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    pt: 2,
                    pb: 3,
                    mb: 5,
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', 
                    flexWrap: { xs: 'wrap', lg: 'nowrap' },
                    gap: 2.5,
                    alignItems: 'center',
                    mx: { xs: -2, md: -4 },
                    px: { xs: 2, md: 4 }
                }}
            >
                <TextField
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ 
                        flexGrow: 1, 
                        minWidth: { xs: '100%', lg: '250px' }, 
                        bgcolor: 'white', 
                        borderRadius: '12px', 
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px',
                            height: 56, 
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 4px 6px -1px rgba(0, 125, 163, 0.2)',
                                borderColor: '#007DA3'
                            }
                        } 
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#9CA3AF' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Autocomplete
                    options={categoryOptions}
                    getOptionLabel={(option) => option.label || ''}
                    value={categoryOptions.find(c => c.value === tab) || categoryOptions[0]}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setTab(newValue.value);
                            sessionStorage.setItem('investaArticleCategory', newValue.value);
                        }
                    }}
                    disableClearable
                    sx={{ 
                        width: { xs: '100%', md: '300px', lg: '280px' },
                        flexShrink: 0,
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px',
                            bgcolor: 'white',
                            height: 56,
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 4px 6px -1px rgba(0, 125, 163, 0.2)',
                                borderColor: '#007DA3'
                            }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            placeholder="All Categories"
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box 
                            component="li" 
                            {...props} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2, 
                                py: 1.5,
                                px: 2,
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: '#e6f5fa !important',
                                    color: '#007DA3'
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(0, 125, 163, 0.1) !important',
                                    color: '#007DA3',
                                    fontWeight: 800
                                }
                            }}
                        >
                            <Typography variant="h6" sx={{ minWidth: 32, textAlign: 'center' }}>{option.icon}</Typography>
                            <Typography variant="body1" fontWeight={600}>{option.label}</Typography>
                        </Box>
                    )}
                />

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0, overflowX: 'auto', pb: { xs: 1, lg: 0 }, '&::-webkit-scrollbar': { display: 'none' } }}>
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mr: 0.5, whiteSpace: 'nowrap' }}>Level:</Typography>
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(r => (
                        <Chip 
                            key={r} label={r}
                            onClick={() => {
                                setDifficultyFilter(r);
                                sessionStorage.setItem('investaArticleDifficulty', r);
                            }}
                            sx={{ 
                                fontWeight: 700, 
                                height: 40,
                                borderRadius: '12px',
                                bgcolor: difficultyFilter === r ? '#007DA3' : 'white', 
                                color: difficultyFilter === r ? 'white' : '#4B5563',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: difficultyFilter === r ? '#007DA3' : '#f1f5f9', color: difficultyFilter === r ? 'white' : '#007DA3' },
                                transition: 'all 0.2s'
                            }} 
                        />
                    ))}
                </Box>
            </Box>

            {/* Article Grid */}
            <Grid container spacing={3}>
                {loading ? (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="text.secondary">Loading articles...</Typography>
                    </Grid>
                ) : articles.length > 0 ? (
                    articles.map(article => {
                        // Map backend fields to what InvestmentCard expects if needed
                        const mappedItem = {
                            ...article,
                            imageUrl: article.image || article.imageUrl,
                            description: article.summary || article.description
                        };
                        return (
                            <Grid item xs={12} sm={6} lg={4} key={article._id}>
                                <InvestmentCard 
                                    item={mappedItem} 
                                    onClick={(item) => navigate(`/article/${item._id}`)}
                                />
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 12 }}>
                            <Typography variant="h6" sx={{ color: '#9CA3AF' }}>No articles found matching your criteria.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(e, p) => setPage(p)} 
                        color="primary" 
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 700,
                            },
                            '& .Mui-selected': {
                                bgcolor: '#007DA3 !important',
                                color: 'white',
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Articles;
