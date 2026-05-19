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

const DEMO_PORTFOLIO = {
    totalValue: 485000,
    investedAmount: 320000,
    totalProfit: 165000,
    totalProfitPercent: '18.4'
};

const DEMO_HOLDINGS = [
    { id: '1', name: 'Nifty 50 Index Fund', type: 'Index Fund/ETF', qty: 500, buyPrice: 100, currentPrice: 240, profit: 70000, profitPercent: '140.00' },
    { id: '2', name: 'S&P 500 ETF', type: 'Index Fund/ETF', qty: 100, buyPrice: 300, currentPrice: 500, profit: 20000, profitPercent: '66.67' },
    { id: '3', name: 'Reliance Industries', type: 'Stock', qty: 20, buyPrice: 2000, currentPrice: 3000, profit: 20000, profitPercent: '50.00' },
    { id: '4', name: 'HDFC Bank', type: 'Stock', qty: 30, buyPrice: 1400, currentPrice: 1880, profit: 14400, profitPercent: '34.29' },
    { id: '5', name: 'TCS', type: 'Stock', qty: 10, buyPrice: 3000, currentPrice: 3500, profit: 5000, profitPercent: '16.67' },
    { id: '6', name: 'Infosys', type: 'Stock', qty: 20, buyPrice: 1250, currentPrice: 1450, profit: 4000, profitPercent: '16.00' },
    { id: '7', name: 'ICICI Bank', type: 'Stock', qty: 30, buyPrice: 800, currentPrice: 950, profit: 4500, profitPercent: '18.75' },
    { id: '8', name: 'Parag Parikh Flexi Cap', type: 'Mutual Fund', qty: 600, buyPrice: 40, currentPrice: 62, profit: 13200, profitPercent: '55.00' },
    { id: '9', name: 'SBI Bluechip Fund', type: 'Mutual Fund', qty: 400, buyPrice: 50, currentPrice: 68, profit: 7200, profitPercent: '36.00' },
    { id: '10', name: 'Sovereign Gold Bond', type: 'Gold', qty: 4, buyPrice: 5000, currentPrice: 6500, profit: 6000, profitPercent: '30.00' },
    { id: '11', name: 'Corporate Debt Fund', type: 'Debt/Bonds', qty: 100, buyPrice: 100, currentPrice: 106, profit: 600, profitPercent: '6.00' },
    { id: '12', name: 'Government G-Sec Fund', type: 'Debt/Bonds', qty: 50, buyPrice: 100, currentPrice: 102, profit: 100, profitPercent: '2.00' }
];

const DEMO_TRANSACTIONS = [
    { id: '1', type: 'Buy', asset: 'Nifty 50 Index Fund', amount: 50000, date: '2026-05-10', status: 'Completed' },
    { id: '2', type: 'Buy', asset: 'S&P 500 ETF', amount: 30000, date: '2026-05-08', status: 'Completed' },
    { id: '3', type: 'Buy', asset: 'Reliance Industries', amount: 40000, date: '2026-05-05', status: 'Completed' },
    { id: '4', type: 'Buy', asset: 'HDFC Bank', amount: 42000, date: '2026-05-02', status: 'Completed' },
    { id: '5', type: 'Buy', asset: 'Sovereign Gold Bond', amount: 20000, date: '2026-04-28', status: 'Completed' }
];

const DEMO_ALLOCATION = {
    labels: ['Equity Mutual Funds', 'Stocks', 'Index Funds & ETFs', 'Gold Investment', 'Fixed Income & Bonds'],
    datasets: [{
        data: [13.3, 43, 35, 5.4, 3.3],
        backgroundColor: ['#007DA3', '#38BDF8', '#0284C7', '#FBBF24', '#F87171'],
        borderWidth: 0,
    }]
};

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [portfolio, setPortfolio] = useState(DEMO_PORTFOLIO);
    const [holdings, setHoldings] = useState(DEMO_HOLDINGS);
    const [transactions, setTransactions] = useState(DEMO_TRANSACTIONS);
    const [allocation, setAllocation] = useState(DEMO_ALLOCATION);
    const [goals, setGoals] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [chartTimeframe, setChartTimeframe] = useState('1M');
    
    const userName = JSON.parse(localStorage.getItem('investaUser'))?.name || 'User';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dashRes = await getDashboardData();
                const { portfolio: apiPortfolio, holdings: apiHoldings, transactions: apiTransactions, allocation: apiAllocation, goals: apiGoals } = dashRes.data;

                if (apiHoldings && apiHoldings.length > 0) {
                    setPortfolio(apiPortfolio);
                    setHoldings(apiHoldings);
                    setTransactions(apiTransactions);
                    setAllocation(apiAllocation);
                } else {
                    setPortfolio(DEMO_PORTFOLIO);
                    setHoldings(DEMO_HOLDINGS);
                    setTransactions(DEMO_TRANSACTIONS);
                    setAllocation(DEMO_ALLOCATION);
                }
                setGoals(apiGoals || []);

                const recRes = await getRecommendations('Moderate').catch(() => ({ data: { summary: "Diversify your portfolio across different asset classes to balance risk and reward." } }));
                setRecommendation(recRes.data || null);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setPortfolio(DEMO_PORTFOLIO);
                setHoldings(DEMO_HOLDINGS);
                setTransactions(DEMO_TRANSACTIONS);
                setAllocation(DEMO_ALLOCATION);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Portfolio Value',
            data: [
                portfolio?.investedAmount || 320000, 
                (portfolio?.investedAmount || 320000) * 1.08, 
                (portfolio?.investedAmount || 320000) * 1.15, 
                (portfolio?.investedAmount || 320000) * 1.22, 
                (portfolio?.investedAmount || 320000) * 1.35, 
                (portfolio?.investedAmount || 320000) * 1.42, 
                portfolio?.totalValue || 485000
            ],
            borderColor: '#007DA3',
            backgroundColor: 'rgba(0, 125, 163, 0.06)',
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#007DA3', letterSpacing: '-0.025em', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                        Dashboard Overview
                    </Typography>
                </Box>
            </Box>

            {/* Premium Portfolio Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '6px', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,125,163,0.08)', borderColor: 'rgba(0,125,163,0.3)' } }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Net Worth</Typography>
                            <Typography variant="h4" sx={{ color: '#007DA3', fontWeight: 900 }}>₹{portfolio?.totalValue.toLocaleString()}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                                <NorthEast sx={{ fontSize: 14, color: '#10B981' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981' }}>
                                    +{portfolio?.totalProfitPercent}% All-time
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '6px', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,125,163,0.08)', borderColor: 'rgba(0,125,163,0.3)' } }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Invested</Typography>
                            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 900 }}>₹{portfolio?.investedAmount.toLocaleString()}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                                Total Capital Deployed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '6px', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,125,163,0.08)', borderColor: 'rgba(0,125,163,0.3)' } }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Total Profit</Typography>
                            <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 900 }}>₹{portfolio?.totalProfit.toLocaleString()}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                                Realized & Unrealized
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '6px', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,125,163,0.08)', borderColor: 'rgba(0,125,163,0.3)' } }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Active Assets</Typography>
                            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 900 }}>{holdings.length}</Typography>
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
