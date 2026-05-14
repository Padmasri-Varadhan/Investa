import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment, Chip, Pagination } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInvestmentIdeas } from '../services/api';
import InvestmentCard from '../components/InvestmentCard';

const InvestmentIdeas = () => {
    const navigate = useNavigate();
    const [ideas, setIdeas] = useState([]);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchIdeas = async () => {
            setLoading(true);
            try {
                const params = {
                    page,
                    limit: itemsPerPage,
                };
                if (tab !== 'all') params.category = tab;
                if (search) params.search = search;
                
                const res = await getInvestmentIdeas(params);
                setIdeas(res.data.data || []);
                setTotalPages(res.data.pagination?.pages || 1);
            } catch (err) {
                console.error("Error fetching investment ideas:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIdeas();
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
        <Box className="fade-in" sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: '#F5F9FC', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    color: '#007DA3', 
                    mb: 6, 
                    letterSpacing: '-0.5px' 
                }}
            >
                Investment Ideas
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
                                '&:hover': { bgcolor: tab === cat ? '#005b7a' : '#F3F4F6' },
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                </Box>
                <TextField
                    placeholder="Search ideas..."
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

            {/* Idea Grid */}
            <Grid container spacing={3}>
                {loading ? (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="text.secondary">Loading ideas...</Typography>
                    </Grid>
                ) : ideas.length > 0 ? (
                    ideas.map(idea => {
                        const mappedItem = {
                            ...idea,
                            description: idea.overview || idea.description,
                        };
                        return (
                            <Grid item xs={12} sm={6} lg={4} key={idea._id}>
                                <InvestmentCard 
                                    item={mappedItem} 
                                    onClick={(item) => navigate(`/idea/${item._id}`)}
                                />
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 12 }}>
                            <Typography variant="h6" sx={{ color: '#9CA3AF' }}>No investment ideas found matching your criteria.</Typography>
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

export default InvestmentIdeas;
