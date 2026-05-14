import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment, Chip, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../services/api';
import InvestmentCard from '../components/InvestmentCard';

const Articles = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
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
                if (tab !== 'all') params.category = tab;
                if (search) params.search = search;
                
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
    }, [page, tab, search]);

    // Reset page when filter/search changes
    useEffect(() => {
        setPage(1);
    }, [tab, search]);



    const categories = [
        'all', 'stocks', 'etf', 'index_fund', 'mutual_fund', 'bonds', 'crypto', 'real_estate', 
        'savings_account', 'fixed_deposit', 'recurring_deposit', 'ppf', 'epf', 'nps', 
        'gold_investment', 'government_schemes', 'corporate_bonds', 'treasury_bills', 
        'reits', 'international_investments'
    ];

    return (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    color: '#007DA3', 
                    mb: 6, 
                    letterSpacing: '-0.5px' 
                }}
            >
                Investment Insights
            </Typography>

            {/* Filter and Search Bar */}
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        overflowX: 'auto', 
                        pb: 1,
                        width: { xs: '100%', md: '70%' },
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '3px' },
                        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }
                    }}
                >
                    {categories.map(cat => (
                        <Chip 
                            key={cat}
                            label={cat.replace(/_/g, ' ').toUpperCase()}
                            onClick={() => setTab(cat)}
                            sx={{ 
                                bgcolor: tab === cat ? '#007DA3' : 'white',
                                color: tab === cat ? 'white' : '#4B5563',
                                fontWeight: 700,
                                px: 1,
                                height: 36,
                                flexShrink: 0,
                                border: '1px solid #E5E7EB',
                                '&:hover': { bgcolor: tab === cat ? '#005b7a' : '#F3F4F6' }
                            }}
                        />
                    ))}
                </Box>
                <TextField
                    placeholder="Search articles..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: { xs: '100%', md: 320 }, bgcolor: 'white', borderRadius: '8px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#9CA3AF' }} />
                            </InputAdornment>
                        ),
                    }}
                />
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
