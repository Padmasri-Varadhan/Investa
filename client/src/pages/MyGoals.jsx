import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button,
    LinearProgress, Chip, IconButton, Avatar, 
    Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Stack, Menu, Alert, Snackbar
} from '@mui/material';
import { 
    Flag, TrendingUp, CalendarMonth, RocketLaunch, 
    CheckCircle, MilitaryTech, MenuBook, 
    WorkspacePremium, ChevronRight, School, Savings, 
    LocalFireDepartment, QueryStats, HistoryEdu,
    Lock, Add, MoreVert, Pause, Edit, Delete, InfoOutlined
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';
import { getGoals, createGoal, deleteGoal, updateGoal } from '../services/api';

ChartJS.register(ArcElement, ChartTooltip, Legend);

// --- Constants & Config ---
const PRIMARY_COLOR = '#007DA3';
const GRADIENT_PRIMARY = 'linear-gradient(135deg, #007DA3 0%, #00A6D6 100%)';
const BG_COLOR = '#F3F7FA';

const onboardingGoals = [
    { id: 'demo-1', title: 'Learn Investing Basics', type: 'Learn Investing Basics', difficulty: 'Beginner', progress: 75, streak: 12, milestones_count: 8, daysLeft: 5, isDemo: true },
    { id: 'demo-2', title: 'Build SIP Habit', type: 'SIP Learning Habit', difficulty: 'Intermediate', progress: 45, streak: 8, milestones_count: 4, daysLeft: 22, isDemo: true },
    { id: 'demo-3', title: 'ETF Learning Journey', type: 'ETF Learning Journey', difficulty: 'Intermediate', progress: 90, streak: 25, milestones_count: 12, daysLeft: 2, isDemo: true },
    { id: 'demo-4', title: 'Read 10 Investment Articles', type: 'Investment Article Reading Goal', difficulty: 'Beginner', progress: 60, streak: 5, milestones_count: 6, daysLeft: 10, isDemo: true }
];

const goalCategories = {
    'Learn Investing Basics': { color: '#007DA3', bg: '#e0f2fe' },
    'ETF Learning Journey': { color: '#7c3aed', bg: '#ede9fe' },
    'SIP Learning Habit': { color: '#059669', bg: '#d1fae5' },
    'Mutual Fund Basics': { color: '#f59e0b', bg: '#fef3c7' },
    'Stock Market Beginner Path': { color: '#ef4444', bg: '#fee2e2' },
    'Portfolio Diversification': { color: '#0891b2', bg: '#ecfeff' },
    'Retirement Planning': { color: '#6366f1', bg: '#e0e7ff' },
    'Daily Investment Habit': { color: '#10b981', bg: '#d1fae5' },
    'Investment Article Reading Goal': { color: '#64748b', bg: '#f1f5f9' },
};

const DIFFICULTY_CONFIG = {
    Beginner: { color: '#059669', bg: '#d1fae5' },
    Intermediate: { color: '#f59e0b', bg: '#fef3c7' },
    Advanced: { color: '#dc2626', bg: '#fee2e2' },
};

// --- Components ---

function HeroSection({ goals = [], isOnboarding = false }) {
    const avgProgress = goals.length > 0 
        ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
        : 0;

    const doughnutData = {
        datasets: [{
            data: [avgProgress, 100 - avgProgress],
            backgroundColor: [PRIMARY_COLOR, '#e2e8f0'],
            borderWidth: 0,
            circumference: 360,
            rotation: 0,
            cutout: '80%',
        }]
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h1" sx={{ 
                        fontSize: '42px', fontWeight: 900, color: PRIMARY_COLOR, 
                        letterSpacing: '-2px', mb: 0 
                    }}>
                        My Goals Journey
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                            OVERALL PROGRESS
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>{avgProgress}%</Typography>
                    </Box>
                    <Box sx={{ position: 'relative', width: 90, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Doughnut data={doughnutData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function GoalCard({ goal, onDelete, onViewDetails }) {
    const config = goalCategories[goal.type] || goalCategories['Learn Investing Basics'];
    const diff = DIFFICULTY_CONFIG[goal.difficulty] || DIFFICULTY_CONFIG.Beginner;
    
    // Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Card sx={{ 
            borderRadius: '20px', mb: 2.5, bgcolor: '#fff', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'visible',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(0,0,0,0.05)' }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    {/* Info Section */}
                    <Grid item xs={12} sm={5}>
                        <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="h6" fontWeight={800} color="#1E293B" sx={{ fontSize: '18px' }}>{goal.title}</Typography>
                                <Chip 
                                    label={goal.difficulty} 
                                    size="small"
                                    sx={{ 
                                        height: 18, fontSize: '9px', fontWeight: 900, 
                                        bgcolor: diff.bg, color: diff.color 
                                    }} 
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {goal.type}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Progress Section */}
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={900} color="#94a3b8">PROGRESS</Typography>
                            <Typography variant="caption" fontWeight={900} color={PRIMARY_COLOR}>{goal.progress || 0}%</Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" value={goal.progress || 0} 
                            sx={{ 
                                height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                                '& .MuiLinearProgress-bar': { background: GRADIENT_PRIMARY, borderRadius: 4 }
                            }} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocalFireDepartment sx={{ fontSize: 14, color: '#f97316' }} />
                                <Typography variant="caption" fontWeight={800} color="#64748b">{goal.streak || 0} Streak</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <WorkspacePremium sx={{ fontSize: 14, color: '#f59e0b' }} />
                                <Typography variant="caption" fontWeight={800} color="#64748b">{goal.milestones_count || 0} Milestones</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarMonth sx={{ fontSize: 14, color: '#007DA3' }} />
                                <Typography variant="caption" fontWeight={800} color="#007DA3">{goal.daysLeft || 30} Days Left</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Actions Section - Extreme Right */}
                    <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                        <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => onViewDetails(goal)}
                            sx={{ 
                                borderRadius: '10px', textTransform: 'none', fontWeight: 800,
                                bgcolor: PRIMARY_COLOR, px: 2, py: 0.8, boxShadow: 'none',
                                '&:hover': { bgcolor: '#005b7a' }
                            }}
                        >
                            View Details
                        </Button>
                        <IconButton 
                            size="small" 
                            onClick={handleMenuClick}
                            sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } }}
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 140 } }}
                        >
                            <MenuItem onClick={() => { handleMenuClose(); onDelete(goal._id || goal.id); }} sx={{ color: '#dc2626', gap: 1.5 }}>
                                <Delete fontSize="small" />
                                <Typography variant="body2" fontWeight={700}>Delete</Typography>
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function ConsistencySidebar({ goals = [] }) {
    const stats = {
        lessons: 0,
        articles: 0,
        research: 0,
        activities: 0
    };

    goals.forEach(goal => {
        const type = goal.type;
        if (['Learn Investing Basics', 'ETF Learning Journey', 'Mutual Fund Basics', 'Stock Market Beginner Path'].includes(type)) {
            stats.lessons += (goal.progress || 0);
        } else if (['Investment Article Reading Goal'].includes(type)) {
            stats.articles += (goal.progress || 0);
        } else if (['Daily Investment Habit'].includes(type)) {
            stats.research += (goal.progress || 0);
        } else {
            stats.activities += (goal.progress || 0);
        }
    });

    const total = stats.lessons + stats.articles + stats.research + stats.activities || 1;
    const getPercent = (val) => Math.round((val / total) * 100);

    const hasGoals = goals.length > 0;

    const donutData = {
        labels: ['Lessons', 'Articles', 'Research', 'Goal Activities'],
        datasets: [{
            data: hasGoals ? [stats.lessons, stats.articles, stats.research, stats.activities] : [0, 0, 0, 1],
            backgroundColor: hasGoals 
                ? ['#007DA3', '#38BDF8', '#7DD3FC', '#BAE6FD']
                : ['#f1f5f9', '#f1f5f9', '#f1f5f9', '#f1f5f9'],
            borderWidth: 0,
            cutout: '75%',
        }]
    };

    return (
        <Card sx={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', bgcolor: '#fff' }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 4, textAlign: 'center', color: '#1e293b' }}>
                    Learning Consistency
                </Typography>
                
                <Box sx={{ height: 220, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Doughnut data={donutData} options={{ 
                        plugins: { legend: { display: false } },
                        maintainAspectRatio: false,
                    }} />
                </Box>

                <Stack spacing={2}>
                    {[
                        { label: 'Lessons Completed', color: '#007DA3', val: hasGoals ? `${getPercent(stats.lessons)}%` : '0%' },
                        { label: 'Articles Read', color: '#38BDF8', val: hasGoals ? `${getPercent(stats.articles)}%` : '0%' },
                        { label: 'Market Research', color: '#7DD3FC', val: hasGoals ? `${getPercent(stats.research)}%` : '0%' },
                        { label: 'Goal Activities', color: '#BAE6FD', val: hasGoals ? `${getPercent(stats.activities)}%` : '0%' },
                    ].map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: item.color }} />
                                <Typography variant="caption" fontWeight={800} color="#64748b">{item.label}</Typography>
                            </Box>
                            <Typography variant="caption" fontWeight={900} color="#1e293b">{item.val}</Typography>
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

// --- Main Page ---

function MyGoals() {
    const [goals, setGoals] = useState([]);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsModal, setDetailsModal] = useState({ open: false, goal: null });
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    
    const [newGoal, setNewGoal] = useState({
        title: '',
        type: 'Learn Investing Basics',
        difficulty: 'Beginner',
        weeklyTarget: '',
        completionDate: '',
        milestones: '',
        notes: ''
    });

    const fetchGoals = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getGoals();
            if (res.data && res.data.length > 0) {
                setGoals(res.data);
                setIsOnboarding(false);
                localStorage.setItem('investa_goals', JSON.stringify(res.data));
            } else {
                const stored = localStorage.getItem('investa_goals');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const filtered = parsed.filter(g => !['d1', 'd2'].includes(g._id || g.id));
                    if (filtered.length > 0) {
                        setGoals(filtered);
                        setIsOnboarding(false);
                    } else {
                        setGoals(onboardingGoals);
                        setIsOnboarding(true);
                    }
                } else {
                    setGoals(onboardingGoals);
                    setIsOnboarding(true);
                }
            }
        } catch (err) {
            console.error("Fetch failed", err);
            setGoals(onboardingGoals);
            setIsOnboarding(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleAddGoal = async () => {
        if (!newGoal.title || !newGoal.weeklyTarget) return;

        const goalData = {
            id: Date.now().toString(),
            ...newGoal,
            progress: 0,
            streak: 0,
            milestones_count: 0,
            daysLeft: Math.ceil((new Date(newGoal.completionDate) - new Date()) / (1000 * 60 * 60 * 24)) || 30
        };

        try {
            await createGoal(goalData);
            const currentGoals = isOnboarding ? [] : goals;
            const updated = [goalData, ...currentGoals];
            setGoals(updated);
            setIsOnboarding(false);
            localStorage.setItem('investa_goals', JSON.stringify(updated));
            setSnack({ open: true, msg: 'Goal created successfully!', severity: 'success' });
        } catch {
            const currentGoals = isOnboarding ? [] : goals;
            const updated = [goalData, ...currentGoals];
            setGoals(updated);
            setIsOnboarding(false);
            localStorage.setItem('investa_goals', JSON.stringify(updated));
            setSnack({ open: true, msg: 'Goal saved locally (Offline)', severity: 'info' });
        }
        
        setIsModalOpen(false);
        setNewGoal({ title: '', type: 'Learn Investing Basics', difficulty: 'Beginner', weeklyTarget: '', completionDate: '', milestones: '', notes: '' });
    };

    const handleDelete = async (id) => {
        const updated = goals.filter(g => (g._id || g.id) !== id);
        setGoals(updated);
        localStorage.setItem('investa_goals', JSON.stringify(updated));
        setSnack({ open: true, msg: 'Goal deleted', severity: 'error' });
        try {
            await deleteGoal(id);
        } catch (err) {
            console.error("Delete failed on server", err);
        }
    };

    const handleViewDetails = (goal) => {
        setDetailsModal({ open: true, goal });
    };

    return (
        <Box sx={{ bgcolor: BG_COLOR, minHeight: '100vh', p: { xs: 2, md: 4 }, pt: { xs: 10, md: 4 } }}>
            <HeroSection goals={goals} isOnboarding={isOnboarding} />

            <Grid container spacing={5}>
                <Grid item xs={12} lg={8.2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" fontWeight={900} color="#1E293B">Active Learning Goals</Typography>
                        <Button 
                            variant="contained" 
                            startIcon={<Add />} 
                            onClick={() => setIsModalOpen(true)}
                            sx={{ 
                                borderRadius: '12px', bgcolor: PRIMARY_COLOR, fontWeight: 900, px: 3,
                                boxShadow: '0 4px 12px rgba(0,125,163,0.2)', '&:hover': { bgcolor: '#005b7a' }
                            }}
                        >
                            Add New Goal
                        </Button>
                    </Box>
                    <Box>
                        {goals.map((goal) => (
                            <GoalCard 
                                key={goal._id || goal.id} 
                                goal={goal} 
                                onDelete={handleDelete}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                        {goals.length === 0 && !loading && (
                            <Box sx={{ p: 10, textAlign: 'center', bgcolor: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                                <Typography color="text.secondary" fontWeight={700}>No active goals. Start your journey today!</Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} lg={3.8}>
                    <ConsistencySidebar goals={goals} />
                </Grid>
            </Grid>

            {/* Add Goal Modal */}
            <Dialog 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                maxWidth="sm" 
                fullWidth 
                PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 900, color: PRIMARY_COLOR }}>Create Learning Goal</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Goal Title" placeholder="e.g. Master the Nifty 50" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Goal Type</InputLabel>
                                    <Select value={newGoal.type} label="Goal Type" onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}>
                                        {Object.keys(goalCategories).map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select value={newGoal.difficulty} label="Difficulty" onChange={(e) => setNewGoal({ ...newGoal, difficulty: e.target.value })}>
                                        <MenuItem value="Beginner">Beginner</MenuItem>
                                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                                        <MenuItem value="Advanced">Advanced</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <TextField fullWidth label="Weekly Target" placeholder="e.g. Read 3 articles weekly" value={newGoal.weeklyTarget} onChange={(e) => setNewGoal({ ...newGoal, weeklyTarget: e.target.value })} />
                        <TextField fullWidth type="date" label="Completion Date" InputLabelProps={{ shrink: true }} value={newGoal.completionDate} onChange={(e) => setNewGoal({ ...newGoal, completionDate: e.target.value })} />
                        <TextField fullWidth multiline rows={2} label="Milestones" value={newGoal.milestones} onChange={(e) => setNewGoal({ ...newGoal, milestones: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 800, color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddGoal} sx={{ borderRadius: '10px', bgcolor: PRIMARY_COLOR, px: 4, fontWeight: 900 }}>Create Goal</Button>
                </DialogActions>
            </Dialog>

            {/* View Details Modal */}
            <Dialog 
                open={detailsModal.open} 
                onClose={() => setDetailsModal({ ...detailsModal, open: false })} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px' } }}
            >
                <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlined color="primary" /> Goal Details
                </DialogTitle>
                <DialogContent>
                    {detailsModal.goal && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>TITLE</Typography>
                                <Typography variant="body1" fontWeight={700}>{detailsModal.goal.title}</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>TYPE</Typography>
                                    <Typography variant="body2" fontWeight={700}>{detailsModal.goal.type}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>STREAK</Typography>
                                    <Typography variant="body2" fontWeight={700}>{detailsModal.goal.streak} Days</Typography>
                                </Grid>
                            </Grid>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>WEEKLY TARGET</Typography>
                                <Typography variant="body2" fontWeight={600}>{detailsModal.goal.weeklyTarget}</Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" color="primary" fontWeight={900}>MILESTONES</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>{detailsModal.goal.milestones || 'No specific milestones listed.'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>PROGRESS</Typography>
                                    <Typography variant="body2" fontWeight={800} color="primary">{detailsModal.goal.progress}%</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={800}>DUE IN</Typography>
                                    <Typography variant="body2" fontWeight={800}>{detailsModal.goal.daysLeft} Days</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button fullWidth variant="outlined" onClick={() => setDetailsModal({ ...detailsModal, open: false })} sx={{ borderRadius: '10px', fontWeight: 800 }}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snack.open} autoHideDuration={3000} 
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}

export default MyGoals;
