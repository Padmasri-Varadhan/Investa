import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    LinearProgress, Chip, IconButton, Alert, Snackbar,
    Select, MenuItem, FormControl, InputLabel, InputAdornment
} from '@mui/material';
import { Add, Flag, Delete, Edit, TrendingUp, AttachMoney, CalendarMonth } from '@mui/icons-material';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import PageHeader from '../components/PageHeader';

/**
 * My Goals Page
 * Allows users to set and track financial goals
 */

const initialGoals = [];

const categoryConfig = {
    savings: { color: '#007DA3', bg: '#e6f5fa', emoji: '💰' },
    retirement: { color: '#7b1fa2', bg: '#f3e5f5', emoji: '🏖️' },
    purchase: { color: '#e65100', bg: '#fff3e0', emoji: '🏠' },
    education: { color: '#00897b', bg: '#e0f2f1', emoji: '🎓' },
    travel: { color: '#f57c00', bg: '#fff8e1', emoji: '✈️' },
    other: { color: '#546e7a', bg: '#f5f5f5', emoji: '🎯' },
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const getDaysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

function GoalCard({ goal, onDelete, onEdit }) {
    const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
    const cat = categoryConfig[goal.category] || categoryConfig.other;
    const daysLeft = getDaysLeft(goal.deadline);
    return (
        <Card className="premium-card" sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 44, height: 44, bgcolor: cat.bg, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                            {cat.emoji}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700}>{goal.title}</Typography>
                            <Chip label={goal.category} size="small" sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 600, fontSize: 10 }} />
                        </Box>
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={() => onEdit(goal)}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => onDelete(goal._id)} sx={{ color: 'error.main' }}><Delete fontSize="small" /></IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                    <Typography variant="caption" fontWeight={700} color={pct >= 100 ? 'success.main' : 'primary'}>{pct}%</Typography>
                </Box>
                <LinearProgress
                    variant="determinate" value={pct}
                    sx={{ height: 8, borderRadius: 4, mb: 2, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: cat.color } }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Saved</Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">{formatCurrency(goal.currentAmount)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Target</Typography>
                        <Typography variant="body2" fontWeight={700}>{formatCurrency(goal.targetAmount)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">Days Left</Typography>
                        <Typography variant="body2" fontWeight={700} color={daysLeft < 30 ? 'error.main' : 'text.primary'}>{daysLeft}d</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

function MyGoals({ user, onUpdateUser }) {
    const [goals, setGoals] = useState(user?.goals || initialGoals);
    const [open, setOpen] = useState(false);
    const [editGoal, setEditGoal] = useState(null);
    const [form, setForm] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '', category: 'savings' });
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getGoals();
                setGoals(res.data);
            } catch (err) {
                console.error("Failed to fetch goals", err);
            }
        };
        fetch();
        const interval = setInterval(fetch, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleOpen = (goal = null) => {
        setEditGoal(goal);
        setForm(goal ? { ...goal } : { title: '', targetAmount: '', currentAmount: '', deadline: '', category: 'savings' });
        setOpen(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.targetAmount) return;
        const goalData = {
            ...form,
            targetAmount: Number(form.targetAmount),
            currentAmount: Number(form.currentAmount) || 0,
        };
        
        try {
            if (editGoal) {
                await updateGoal(editGoal._id, goalData);
                setSnack({ open: true, msg: 'Goal updated successfully!', severity: 'success' });
            } else {
                await createGoal(goalData);
                setSnack({ open: true, msg: 'Goal created successfully!', severity: 'success' });
            }
            const res = await getGoals();
            setGoals(res.data);
            setOpen(false);
        } catch (err) {
            setSnack({ open: true, msg: 'Failed to save goal', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGoal(id);
            const res = await getGoals();
            setGoals(res.data);
            setSnack({ open: true, msg: 'Goal deleted', severity: 'info' });
        } catch {
            setSnack({ open: true, msg: 'Failed to delete from server', severity: 'error' });
        }
    };

    const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    const overallPct = Math.round((totalSaved / totalTarget) * 100);

    return (
        <Box className="fade-in" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto', pb: 6 }}>
            <PageHeader 
                title="My Financial Goals" 
                subtitle="Track your progress towards financial freedom"
                icon={<Flag />}
                action={
                    <Button
                        variant="contained" 
                        startIcon={<Add />}
                        onClick={() => handleOpen()} 
                        sx={{ 
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 1,
                            boxShadow: '0 4px 12px rgba(0, 125, 163, 0.2)'
                        }}
                    >
                        Add Goal
                    </Button>
                }
            />

            {/* Overview Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight={700}>Overall Progress</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary">{overallPct}%</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate" value={overallPct}
                        sx={{ height: 12, borderRadius: 6, mb: 2, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: '#007DA3' } }}
                    />
                    <Grid container spacing={2}>
                        {[
                            { label: 'Total Goals', value: goals.length, icon: '🎯' },
                            { label: 'Total Saved', value: formatCurrency(totalSaved), icon: '💰' },
                            { label: 'Total Target', value: formatCurrency(totalTarget), icon: '📊' },
                            { label: 'Remaining', value: formatCurrency(totalTarget - totalSaved), icon: '⏳' },
                        ].map((s) => (
                            <Grid item xs={6} sm={3} key={s.label}>
                                <Box sx={{ textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 2, p: 1.5 }}>
                                    <Typography variant="h5">{s.icon}</Typography>
                                    <Typography variant="subtitle2" fontWeight={800}>{s.value}</Typography>
                                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {goals.map((goal) => (
                    <Grid item xs={12} sm={6} md={4} key={goal._id}>
                        <GoalCard goal={goal} onDelete={handleDelete} onEdit={handleOpen} />
                    </Grid>
                ))}
                {/* Add Goal Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        onClick={() => handleOpen()}
                        sx={{
                            height: '100%', minHeight: 200, border: '2px dashed #cfd8dc', bgcolor: 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s',
                            '&:hover': { border: '2px dashed #007DA3', bgcolor: '#f5f9ff' },
                        }}
                    >
                        <Box sx={{ textAlign: 'center', color: '#90a4ae' }}>
                            <Add sx={{ fontSize: 40, mb: 1, color: '#007DA3' }} />
                            <Typography variant="subtitle1" fontWeight={600} color="primary">Add New Goal</Typography>
                            <Typography variant="caption">Click to set a new financial goal</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Add/Edit Goal Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Goal Title" value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        sx={{ mt: 1, mb: 2 }} placeholder="e.g., Emergency Fund"
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} label="Category">
                            {Object.entries(categoryConfig).map(([k, v]) => (
                                <MenuItem key={k} value={k}>{v.emoji} {k.charAt(0).toUpperCase() + k.slice(1)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth label="Target Amount (₹)" type="number" value={form.targetAmount}
                        onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                        sx={{ mb: 2 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
                    />
                    <TextField
                        fullWidth label="Current Amount (₹)" type="number" value={form.currentAmount}
                        onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
                        sx={{ mb: 2 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><TrendingUp /></InputAdornment> }}
                    />
                    <TextField
                        fullWidth label="Target Date" type="date" value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth /></InputAdornment> }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#546e7a' }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>
                        {editGoal ? 'Update Goal' : 'Create Goal'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}

export default MyGoals;
