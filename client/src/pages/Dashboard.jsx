import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Avatar } from '@mui/material';
import { 
    TrendingUp, AccountBalance, ShowChart, 
    NorthEast, SouthEast, MoreVert 
} from '@mui/icons-material';
import { getGoals, getRecommendations } from '../services/api';
import TitleCard from '../components/TitleCard';
import DashboardCard from '../components/DashboardCard';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const [goals, setGoals] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const userName = JSON.parse(localStorage.getItem('investaUser'))?.name || 'User';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const goalsRes = await getGoals();
                const recRes = await getRecommendations();
                setGoals(goalsRes.data || []);
                setRecommendation(recRes.data || null);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Portfolio Value',
            data: [450000, 480000, 465000, 510000, 540000, 580000],
            borderColor: '#007DA3',
            backgroundColor: 'rgba(0, 125, 163, 0.05)',
            fill: true,
            tension: 0.4,
        }]
    };

    return (
        <Box sx={{ px: { xs: 2, md: 8 }, py: 6, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
            <TitleCard 
                title="Dashboard Overview" 
                subtitle={`Welcome back, ${userName}. Here is what's happening with your investments today.`}
            />

            {/* Quick Stats Grid */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                    <DashboardCard 
                        title="Total Portfolio" 
                        value="₹5,80,000" 
                        change="+12.5%" 
                        icon={<AccountBalance />} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCard 
                        title="Monthly Gain" 
                        value="₹42,300" 
                        change="+4.2%" 
                        icon={<TrendingUp />} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <DashboardCard 
                        title="Investment Rate" 
                        value="28%" 
                        change="-1.5%" 
                        icon={<ShowChart />} 
                    />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {/* Chart Section */}
                <Grid item xs={12} lg={8}>
                    <DashboardCard title="Performance Analytics">
                        <Box sx={{ height: 350, mt: 2 }}>
                            <Line data={trendData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </Box>
                    </DashboardCard>
                </Grid>

                {/* Secondary Section */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <DashboardCard title="AI Insights">
                            <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.7, mb: 3 }}>
                                {recommendation ? recommendation.summary : "Analyzing your portfolio for personalized insights..."}
                            </Typography>
                            <Button fullWidth variant="contained" sx={{ bgcolor: '#007DA3', py: 1.5, '&:hover': { bgcolor: '#005b7a' } }}>
                                View Full Report
                            </Button>
                        </DashboardCard>
                        
                        <DashboardCard title="Recent Activity">
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {[
                                    { name: 'Apple Inc. SIP', date: '2 hours ago', amount: '+ ₹5,000', up: true },
                                    { name: 'HDFC Bank Div.', date: 'Yesterday', amount: '+ ₹1,200', up: true },
                                    { name: 'Crypto Rebalance', date: 'Jan 22', amount: '- ₹8,400', up: false }
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>{item.date}</Typography>
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: item.up ? '#059669' : '#DC2626' }}>
                                            {item.amount}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </DashboardCard>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
