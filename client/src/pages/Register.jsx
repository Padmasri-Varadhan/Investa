import React, { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography,
    Alert, CircularProgress, Divider, InputAdornment, IconButton,
    Link, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
    Person, Email, Lock, Visibility, VisibilityOff, TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

/**
 * Register Page
 */
function Register({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        preferredLanguage: 'English',
        riskProfile: 'Moderate',
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match!');
        }
        if (form.password.length < 8) {
            return setError('Password must be at least 8 characters');
        }
        
        setLoading(true);
        try {
            const { confirmPassword, ...data } = form;
            const res = await registerUser(data);
            onLogin(res.data);
            navigate('/guided-journey');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#007DA3',
                display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
            }}
        >
            <Card sx={{ maxWidth: 460, width: '100%', p: 1, borderRadius: 1.5 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                            <TrendingUp sx={{ color: '#007DA3', fontSize: 32 }} />
                            <Typography variant="h5" fontWeight={800} color="primary">Investa</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} mb={0.5}>Create Your Account</Typography>
                        <Typography variant="body2" color="text.secondary">Start your personalized investment journey today</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Full Name" name="name" value={form.name}
                            onChange={handleChange} required sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#78909c' }} /></InputAdornment> }}
                        />
                        <TextField
                            fullWidth label="Email Address" name="email" type="email"
                            value={form.email} onChange={handleChange} required sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#78909c' }} /></InputAdornment> }}
                        />
                        <TextField
                            fullWidth label="Password" name="password"
                            type={showPass ? 'text' : 'password'}
                            value={form.password} onChange={handleChange} required sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#78909c' }} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth label="Confirm Password" name="confirmPassword"
                            type="password" value={form.confirmPassword}
                            onChange={handleChange} required sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#78909c' }} /></InputAdornment> }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Risk Profile</InputLabel>
                            <Select name="riskProfile" value={form.riskProfile} onChange={handleChange} label="Risk Profile">
                                <MenuItem value="Conservative">Conservative</MenuItem>
                                <MenuItem value="Moderate">Moderate</MenuItem>
                                <MenuItem value="Aggressive">Aggressive</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Preferred Language</InputLabel>
                            <Select 
                                name="preferredLanguage" 
                                value={form.preferredLanguage} 
                                onChange={handleChange} 
                                label="Preferred Language"
                                sx={{ 
                                    cursor: 'pointer',
                                    '& .MuiSelect-select': { cursor: 'pointer' },
                                    '& .MuiSelect-icon': { cursor: 'pointer' }
                                }}
                            >
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Spanish">Spanish</MenuItem>
                                <MenuItem value="French">French</MenuItem>
                                <MenuItem value="Hindi">Hindi</MenuItem>
                                <MenuItem value="Tamil">Tamil</MenuItem>
                                <MenuItem value="German">German</MenuItem>
                                <MenuItem value="Chinese">Chinese</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit" variant="contained" fullWidth size="large"
                            disabled={loading} sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, mb: 1.5 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
                        </Button>
                    </form>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Already have an account?{' '}
                        <Link component="button" onClick={() => navigate('/login')} sx={{ fontWeight: 700, color: '#007DA3' }}>
                            Login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Register;
