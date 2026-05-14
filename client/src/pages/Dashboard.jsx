import React, { useEffect, useState } from 'react';
import { 
    Box, Grid, Typography, Button, Avatar, Chip, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, ButtonGroup,
    CircularProgress, Alert, Stack, Card, CardContent
} from '@mui/material';
import { 
    TrendingUp, AccountBalance, ShowChart, 
    NorthEast, SouthEast, MoreVert,
    Wallet, PieChart, History, AutoAwesome,
    EmojiEvents, Assessment, Flag
} from '@mui/icons-material';
import { getGoals, getRecommendations, getDashboardData, getNews } from '../services/api';
import TitleCard from '../components/TitleCard';
import DashboardCard from '../components/DashboardCard';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, 
    PointElement, LineElement, Title, Tooltip, 
    Legend, Filler, ArcElement 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './DashboardStyles.css';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, 
    LineElement, Title, Tooltip, Legend, Filler, ArcElement
);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [portfolio, setPortfolio] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [allocation, setAllocation] = useState(null);
    const [goals, setGoals] = useState([]);
    const [news, setNews] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [chartTimeframe, setChartTimeframe] = useState('1M');
    
    const userName = JSON.parse(localStorage.getItem('investaUser'))?.name || 'User';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dashRes = await getDashboardData();
                const { portfolio, holdings, transactions, allocation, goals: apiGoals } = dashRes.data;

                setPortfolio(portfolio);
                setHoldings(holdings);
                setTransactions(transactions);
                setAllocation(allocation);
                setGoals(apiGoals);

                const newsRes = await getNews().catch(() => ({ data: [] }));
                setNews(newsRes.data);

                const recRes = await getRecommendations('Moderate').catch(() => ({ data: { summary: "Diversify your portfolio across different asset classes to balance risk and reward." } }));
                setRecommendation(recRes.data || null);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const trendData = {
        labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
        datasets: [{
            label: 'Portfolio Value',
            data: [portfolio?.investedAmount || 0, (portfolio?.investedAmount || 0) * 1.02, (portfolio?.investedAmount || 0) * 1.05, (portfolio?.investedAmount || 0) * 1.03, (portfolio?.investedAmount || 0) * 1.08, (portfolio?.totalValue || 0)],
            borderColor: '#007DA3',
            backgroundColor: 'rgba(0, 125, 163, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#007DA3',
        }]
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: '#007DA3' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 4, bgcolor: '#F9FAFB', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            
            {/* Live News Ticker */}
            {news.length > 0 && (
                <Box className="news-ticker-container">
                    <Box className="news-ticker-wrapper">
                        {news.map((item, i) => (
                            <Box key={i} className="news-item">
                                <Box className="news-dot" />
                                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                    {item.title} — {item.source}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -1.5 }}>
                        Welcome back, {userName.split(' ')[0]}!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                        Here is what's happening with your portfolio today.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AutoAwesome />}
                    sx={{ bgcolor: '#007DA3', borderRadius: '12px', fontWeight: 700, px: 3 }}
                    onClick={() => window.location.href='/chatbot'}
                >
                    AI Insights
                </Button>
            </Box>

            {/* Premium Portfolio Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="gradient-card-blue" sx={{ borderRadius: 4, boxShadow: '0 10px 20px rgba(0, 125, 163, 0.2)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography className="premium-stat-label">Net Worth</Typography>
                            <Typography className="premium-stat-value">₹{portfolio?.totalValue.toLocaleString()}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                                <NorthEast sx={{ fontSize: 14, color: '#69f0ae' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#69f0ae' }}>
                                    +{portfolio?.totalProfitPercent}% All-time
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#fff', border: '1px solid #f1f5f9' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography className="premium-stat-label" sx={{ color: '#64748b' }}>Invested</Typography>
                            <Typography className="premium-stat-value" sx={{ color: '#1e293b' }}>₹{portfolio?.investedAmount.toLocaleString()}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                                Total Capital Deployed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className="gradient-card-green" sx={{ borderRadius: 4, boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography className="premium-stat-label">Total Profit</Typography>
                            <Typography className="premium-stat-value">₹{portfolio?.totalProfit.toLocaleString()}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>
                                Realized & Unrealized
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#fff', border: '1px solid #f1f5f9' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography className="premium-stat-label" sx={{ color: '#64748b' }}>Active Assets</Typography>
                            <Typography className="premium-stat-value" sx={{ color: '#1e293b' }}>{holdings.length}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                                Diversified across {allocation?.labels?.length || 0} classes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={4}>
                {/* Growth Chart */}
                <Grid item xs={12} lg={8}>
                    <DashboardCard title="Performance Growth" titleColor="#1e293b">
                        <Box sx={{ height: 350, mt: 2 }}>
                            <Line data={trendData} options={{ 
                                maintainAspectRatio: false, 
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: '#f1f5f9' }, ticks: { callback: (val) => '₹' + val.toLocaleString(), color: '#94a3b8' } },
                                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                }
                            }} />
                        </Box>
                    </DashboardCard>
                </Grid>

                {/* Allocation Pie */}
                <Grid item xs={12} lg={4}>
                    <DashboardCard title="Asset Allocation" titleColor="#1e293b">
                        <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', mt: 4 }}>
                            {allocation && <Doughnut data={allocation} options={{ 
                                maintainAspectRatio: false,
                                plugins: { 
                                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { weight: 700 } } }
                                },
                                cutout: '75%'
                            }} />}
                        </Box>
                    </DashboardCard>
                </Grid>

                {/* Learning & Goals Section */}
                <Grid item xs={12} md={6}>
                    <DashboardCard title="Top Goal Progress" icon={<Flag sx={{ color: '#007DA3' }} />} titleColor="#1e293b">
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {goals.slice(0, 3).map((goal, idx) => (
                                <Box key={idx}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{goal.title}</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#007DA3' }}>{goal.progress}%</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                        <Box sx={{ 
                                            position: 'absolute', top: 0, left: 0, height: '100%', 
                                            width: `${goal.progress}%`, bgcolor: '#007DA3', borderRadius: 4,
                                            transition: 'width 1s ease-in-out'
                                        }} />
                                    </Box>
                                </Box>
                            ))}
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                onClick={() => window.location.href='/my-goals'}
                                sx={{ borderRadius: '12px', fontWeight: 800, textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}
                            >
                                View All Goals
                            </Button>
                        </Stack>
                    </DashboardCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <DashboardCard title="Learning Consistency" icon={<EmojiEvents sx={{ color: '#f59e0b' }} />} titleColor="#1e293b">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 2 }}>
                            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={78} 
                                    size={120} 
                                    thickness={5} 
                                    sx={{ color: '#007DA3', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} 
                                />
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#007DA3' }}>78%</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>STREAK</Typography>
                                </Box>
                            </Box>
                            <Stack spacing={2} sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Articles Read</Typography>
                                    <Chip label="22 / 50" size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', fontSize: '10px' }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Lessons Completed</Typography>
                                    <Chip label="12 / 15" size="small" sx={{ fontWeight: 800, bgcolor: '#f1f5f9', fontSize: '10px' }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Market Analysis</Typography>
                                    <Chip label="Daily" size="small" sx={{ fontWeight: 800, bgcolor: '#f0fdf4', color: '#166534', fontSize: '10px' }} />
                                </Box>
                            </Stack>
                        </Box>
                    </DashboardCard>
                </Grid>

                {/* Holdings Table */}
                <Grid item xs={12}>
                    <DashboardCard title="Your Portfolio Holdings" icon={<Assessment />} titleColor="#1e293b">
                        <TableContainer component={Box} className="dashboard-scroll" sx={{ mt: 2 }}>
                            <Table className="premium-table">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 800 }}>ASSET NAME</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>QUANTITY</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>BUY PRICE</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>CURRENT</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>P&L STATUS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {holdings.map((row) => (
                                        <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.profit >= 0 ? '#10b981' : '#ef4444' }} />
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>{row.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{row.type}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>{row.qty}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>₹{row.buyPrice.toLocaleString()}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>₹{row.currentPrice.toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                    <Typography sx={{ color: row.profit >= 0 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                                                        {row.profit >= 0 ? '+' : ''}₹{row.profit.toLocaleString()}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${row.profitPercent}%`} 
                                                        size="small" 
                                                        sx={{ 
                                                            height: 18, fontSize: '10px', fontWeight: 800,
                                                            bgcolor: row.profit >= 0 ? '#d1fae5' : '#fee2e2',
                                                            color: row.profit >= 0 ? '#065f46' : '#991b1b'
                                                        }} 
                                                    />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DashboardCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
