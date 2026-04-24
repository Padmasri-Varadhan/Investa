import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, TextField, InputAdornment, Chip } from '@mui/material';
import { Search, Add, AdminPanelSettings } from '@mui/icons-material';
import { getArticles } from '../services/api';
import TitleCard from '../components/TitleCard';
import InvestmentCard from '../components/InvestmentCard';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await getArticles();
                setArticles(res.data || []);
            } catch (err) {
                console.error("Error fetching articles:", err);
            }
        };
        fetchArticles();
    }, []);

    const filtered = articles.filter(a => {
        const matchesTab = tab === 'all' || a.category === tab;
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const categories = ['all', 'stocks', 'etf', 'crypto', 'real_estate', 'bonds'];

    return (
        <Box sx={{ px: { xs: 2, md: 8 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
            <TitleCard 
                title="Investment Insights" 
                subtitle="Expert analysis and market news to help you make informed decisions."
                action={
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AdminPanelSettings />}
                            onClick={() => setIsAdmin(!isAdmin)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                        >
                            {isAdmin ? 'Admin On' : 'Admin'}
                        </Button>
                        {isAdmin && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                sx={{ bgcolor: '#007DA3', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                            >
                                New Article
                            </Button>
                        )}
                    </Box>
                }
            />

            {/* Filter and Search Bar */}
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <Chip 
                            key={cat}
                            label={cat.replace('_', ' ').toUpperCase()}
                            onClick={() => setTab(cat)}
                            sx={{ 
                                bgcolor: tab === cat ? '#007DA3' : 'white',
                                color: tab === cat ? 'white' : '#4B5563',
                                fontWeight: 700,
                                px: 1,
                                height: 36,
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
                {filtered.map(article => (
                    <Grid item xs={12} sm={6} lg={4} key={article._id}>
                        <InvestmentCard 
                            item={article} 
                            onClick={(item) => console.log("Article clicked:", item)}
                        />
                    </Grid>
                ))}
            </Grid>

            {filtered.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <Typography variant="h6" sx={{ color: '#9CA3AF' }}>No articles found matching your criteria.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Articles;
