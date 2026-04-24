import React, { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography,
    Alert, CircularProgress, Divider, InputAdornment, IconButton, Link,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

/**
 * Login Page
 */
function Login({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', preferredLanguage: 'English' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(form);
            onLogin(res.data);
            navigate('/guided-journey');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Demo login
    const handleDemoLogin = async () => {
        setForm({ ...form, email: 'demo@investa.com', password: 'demo1234' });
        setError('');
        setLoading(true);
        try {
            const res = await loginUser({ email: 'demo@investa.com', password: 'demo1234' });
            onLogin(res.data);
            navigate('/guided-journey');
        } catch {
            // If demo user doesn't exist, register first
            try {
                const { registerUser } = await import('../services/api');
                const regRes = await registerUser({ name: 'Demo User', email: 'demo@investa.com', password: 'demo1234', preferredLanguage: 'English' });
                onLogin(regRes.data);
                navigate('/guided-journey');
            } catch (err2) {
                setError('Demo login failed. Please register manually.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #007DA3 0%, #005b7a 60%, #003c72 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
            }}
        >
            <Card sx={{ maxWidth: 420, width: '100%', p: 1, borderRadius: 1.5 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                            <TrendingUp sx={{ color: '#007DA3', fontSize: 32 }} />
                            <Typography variant="h5" fontWeight={800} color="primary">Investa</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} mb={0.5}>Welcome back! 👋</Typography>
                        <Typography variant="body2" color="text.secondary">Sign in to continue your investment journey</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Email Address" name="email" type="email"
                            value={form.email} onChange={handleChange} required
                            sx={{ mb: 2 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#78909c' }} /></InputAdornment> }}
                        />
                        <TextField
                            fullWidth label="Password" name="password"
                            type={showPass ? 'text' : 'password'}
                            value={form.password} onChange={handleChange} required
                            sx={{ mb: 3 }}
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
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Preferred Language</InputLabel>
                            <Select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange} label="Preferred Language">
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
                            disabled={loading}
                            sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, mb: 1.5 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                        </Button>
                    </form>

                    <Button
                        variant="outlined" fullWidth size="large"
                        onClick={handleDemoLogin} disabled={loading}
                        sx={{ borderRadius: 2, fontWeight: 600, mb: 2, borderColor: '#007DA3', color: '#007DA3' }}
                    >
                        Try Demo Account
                    </Button>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Don't have an account?{' '}
                        <Link component="button" onClick={() => navigate('/register')} sx={{ fontWeight: 700, color: '#007DA3' }}>
                            Sign up for free
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
