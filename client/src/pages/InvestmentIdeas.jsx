import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, InputAdornment, Chip, Pagination, Autocomplete } from '@mui/material';
import { Search, Category as CategoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInvestmentIdeas } from '../services/api';
import InvestmentCard from '../components/InvestmentCard';

const InvestmentIdeas = () => {
    const navigate = useNavigate();
    const [ideas, setIdeas] = useState([]);
    const [tab, setTab] = useState(() => sessionStorage.getItem('investaSelectedCategory') || 'All');
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');
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
                if (tab !== 'All') params.category = tab;
                if (search) params.search = search;
                if (riskFilter !== 'All') params.risk = riskFilter.toLowerCase();
                
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
    }, [page, tab, search, riskFilter]);

    // Reset page when filter/search changes
    useEffect(() => {
        setPage(1);
    }, [tab, search]);

    const categoryOptions = [
        { label: 'All Categories', value: 'All', icon: '🌐' },
        { label: 'Savings Account', value: 'Savings Account', icon: '🏦' },
        { label: 'Fixed Deposit (FD)', value: 'Fixed Deposit (FD)', icon: '🔒' },
        { label: 'Recurring Deposit (RD)', value: 'Recurring Deposit (RD)', icon: '🔄' },
        { label: 'Public Provident Fund (PPF)', value: 'Public Provident Fund (PPF)', icon: '🏛️' },
        { label: 'Employee Provident Fund (EPF)', value: 'Employee Provident Fund (EPF)', icon: '🏢' },
        { label: 'National Pension System (NPS)', value: 'National Pension System (NPS)', icon: '👴' },
        { label: 'Gold Investment', value: 'Gold Investment', icon: '🥇' },
        { label: 'Government Schemes', value: 'Government Schemes', icon: '📜' },
        { label: 'Corporate Bonds', value: 'Corporate Bonds', icon: '🏢' },
        { label: 'Treasury Bills', value: 'Treasury Bills', icon: '📄' },
        { label: 'REITs', value: 'REITs', icon: '🏢' },
        { label: 'International Investments', value: 'International Investments', icon: '🌍' },
        { label: 'Mutual Funds', value: 'Mutual Funds', icon: '💼' },
        { label: 'SIP Investments', value: 'SIP Investments', icon: '🔄' },
        { label: 'Stocks', value: 'Stocks', icon: '📊' },
        { label: 'Cryptocurrency', value: 'Cryptocurrency', icon: '₿' },
        { label: 'Real Estate', value: 'Real Estate', icon: '🏘️' },
        { label: 'ETFs', value: 'ETFs', icon: '🔗' },
        { label: 'Index Funds', value: 'Index Funds', icon: '📈' }
    ];

    return (
        <Box className="fade-in" sx={{ px: { xs: 2, md: 4 }, py: 6, bgcolor: '#F5F9FC', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    color: '#007DA3', 
                    mb: 2, 
                    letterSpacing: '-0.5px' 
                }}
            >
                Investment Ideas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 800 }}>
                Explore over 190 curated investment strategies across 19 categories. Find the perfect balance of risk and reward for your financial goals.
            </Typography>

            {/* Sticky Filter and Search Bar */}
            <Box 
                sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 10, 
                    bgcolor: 'rgba(245, 249, 252, 0.95)', 
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
                    placeholder="Search investment ideas..."
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
                            sessionStorage.setItem('investaSelectedCategory', newValue.value);
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
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start" sx={{ pl: 1 }}>
                                            <CategoryIcon sx={{ color: '#007DA3' }} />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                )
                            }}
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
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mr: 0.5, whiteSpace: 'nowrap' }}>Risk Level:</Typography>
                    {['All', 'Low', 'Medium', 'High'].map(r => (
                        <Chip 
                            key={r} label={r}
                            onClick={() => setRiskFilter(r)}
                            sx={{ 
                                fontWeight: 700, 
                                height: 40,
                                borderRadius: '12px',
                                bgcolor: riskFilter === r ? '#007DA3' : 'white', 
                                color: riskFilter === r ? 'white' : '#4B5563',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: riskFilter === r ? '#007DA3' : '#f1f5f9', color: riskFilter === r ? 'white' : '#007DA3' },
                                transition: 'all 0.2s'
                            }} 
                        />
                    ))}
                </Box>
            </Box>

            {/* Display selected category information */}
            {tab !== 'All' && (
                <Box sx={{ mb: 6, p: 3, bgcolor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h3">{categoryOptions.find(c => c.value === tab)?.icon}</Typography>
                        <Typography variant="h5" fontWeight={800} color="#007DA3">
                            {tab}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Showing all specialized investment opportunities within the {tab} category. 
                        Use the risk filter above to narrow down options based on your risk appetite.
                    </Typography>
                </Box>
            )}

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
