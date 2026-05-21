import React, { useState } from 'react';
import {
    Container, Typography, Box, Card, CardContent, Grid,
    TextField, Button, Switch, Divider, Stack, Alert, Dialog, DialogTitle, DialogContent, 
    DialogActions, FormControl, InputLabel, Select, MenuItem,
    List, ListItem, ListItemText
} from '@mui/material';
import {
    Save, Logout, DeleteForever
} from '@mui/icons-material';
import { updateUserProfile, changePassword } from '../services/api';

/**
 * Settings Page - Refined Unified Version
 * Improved spacing, uppercase headings, and expanded options.
 */

function Settings({ user, onLogout, onUpdateUser }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Profile State
    const nameParts = (user?.name || '').split(' ');
    const fName = nameParts[0] || '';
    const lName = nameParts.slice(1).join(' ') || '';

    const [formData, setFormData] = useState({
        firstName: fName,
        lastName: lName,
        email: user?.email || '',
        riskTolerance: user?.riskProfile || 'moderate',
        investmentGoal: 'wealth',
        investmentHorizon: 'long',
        language: 'en',
        currency: 'INR',
        emailNotifications: true,
        investmentAlerts: true,
        articleUpdates: false,
        twoFactor: false,
        darkMode: false
    });

    // Password Dialog State
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggle = (name) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                riskProfile: formData.riskTolerance
            };
            const res = await updateUserProfile(payload);
            if (onUpdateUser) onUpdateUser(res.data);
            setStatus({ type: 'success', msg: 'Settings updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword.length < 8) {
            setPassStatus({ type: 'error', msg: 'Password must be at least 8 characters long' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPassStatus({ type: 'error', msg: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setPassStatus({ type: '', msg: '' });
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPassStatus({ type: 'success', msg: 'Password changed successfully!' });
            setTimeout(() => {
                setOpenPasswordDialog(false);
                setPassStatus({ type: '', msg: '' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }, 2000);
        } catch (err) {
            setPassStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const SectionHeading = ({ title }) => (
        <Typography 
            variant="h6" 
            fontWeight={800} 
            color="#007DA3" 
            sx={{ 
                mt: 6, 
                mb: 2.5, 
                display: 'block',
                letterSpacing: 0.2,
                fontSize: '1.1rem'
            }}
        >
            {title}
        </Typography>
    );

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={900} color="#007DA3">Settings</Typography>
            </Box>

            {status.msg && <Alert severity={status.type} sx={{ mb: 4, borderRadius: 2 }}>{status.msg}</Alert>}

            <Card variant="outlined" sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    
                    {/* Account Details */}
                    <SectionHeading title="Account Details" />
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth label="First Name" name="firstName" 
                                value={formData.firstName} onChange={handleChange} 
                                variant="outlined" size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth label="Last Name" name="lastName" 
                                value={formData.lastName} onChange={handleChange} 
                                variant="outlined" size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth label="Email Address" name="email" 
                                value={formData.email} onChange={handleChange} 
                                variant="outlined" size="small"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Investment Preferences */}
                    <SectionHeading title="Investment Preferences" />
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="risk-label" sx={{ fontSize: '1rem', fontWeight: 600 }}>Risk</InputLabel>
                                <Select 
                                    labelId="risk-label"
                                    id="risk-select"
                                    name="riskTolerance" 
                                    value={formData.riskTolerance} 
                                    label="Risk" 
                                    onChange={handleChange}
                                    sx={{ bgcolor: '#fff', fontSize: '1rem', borderRadius: 2 }}
                                >
                                    <MenuItem value="low" sx={{ fontSize: '1rem' }}>Conservative (Low Risk)</MenuItem>
                                    <MenuItem value="moderate" sx={{ fontSize: '1rem' }}>Moderate (Balanced)</MenuItem>
                                    <MenuItem value="high" sx={{ fontSize: '1rem' }}>Aggressive (High Growth)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="goal-label" sx={{ fontSize: '1rem', fontWeight: 600 }}>Primary Goal</InputLabel>
                                <Select 
                                    labelId="goal-label"
                                    id="goal-select"
                                    name="investmentGoal" 
                                    value={formData.investmentGoal} 
                                    label="Primary Goal" 
                                    onChange={handleChange}
                                    sx={{ bgcolor: '#fff', fontSize: '1rem', borderRadius: 2 }}
                                >
                                    <MenuItem value="wealth" sx={{ fontSize: '1rem' }}>Wealth Creation</MenuItem>
                                    <MenuItem value="retirement" sx={{ fontSize: '1rem' }}>Retirement Planning</MenuItem>
                                    <MenuItem value="income" sx={{ fontSize: '1rem' }}>Passive Income</MenuItem>
                                    <MenuItem value="tax" sx={{ fontSize: '1rem' }}>Tax Saving</MenuItem>
                                    <MenuItem value="education" sx={{ fontSize: '1rem' }}>Education</MenuItem>
                                    <MenuItem value="emergency" sx={{ fontSize: '1rem' }}>Emergency Fund</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="horizon-label" sx={{ fontSize: '1rem', fontWeight: 600 }}>Time Horizon</InputLabel>
                                <Select 
                                    labelId="horizon-label"
                                    id="horizon-select"
                                    name="investmentHorizon" 
                                    value={formData.investmentHorizon} 
                                    label="Time Horizon" 
                                    onChange={handleChange}
                                    sx={{ bgcolor: '#fff', fontSize: '1rem', borderRadius: 2 }}
                                >
                                    <MenuItem value="short" sx={{ fontSize: '1rem' }}>Short-term (0-3 years)</MenuItem>
                                    <MenuItem value="mid" sx={{ fontSize: '1rem' }}>Mid-term (3-7 years)</MenuItem>
                                    <MenuItem value="long" sx={{ fontSize: '1rem' }}>Long-term (7+ years)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Security */}
                    <SectionHeading title="Security" />
                    <List disablePadding>
                        <ListItem sx={{ px: 0, py: 2 }}>
                            <ListItemText 
                                primary={<Typography fontWeight={700}>Password</Typography>} 
                                secondary="Add a strong password to keep your account safe" 
                            />
                            <Button variant="outlined" size="small" onClick={() => setOpenPasswordDialog(true)} sx={{ color: '#007DA3', borderColor: '#007DA3', fontWeight: 700, textTransform: 'none', px: 3 }}>Change Password</Button>
                        </ListItem>
                        <Divider sx={{ opacity: 0.6 }} />
                        <ListItem sx={{ px: 0, py: 2 }}>
                            <ListItemText 
                                primary={<Typography fontWeight={700}>Two-Factor Authentication</Typography>} 
                                secondary="Secure your account with an extra verification step" 
                            />
                            <Switch checked={formData.twoFactor} onChange={() => handleToggle('twoFactor')} color="primary" />
                        </ListItem>
                        <Divider sx={{ opacity: 0.6 }} />
                        <ListItem sx={{ px: 0, py: 2 }}>
                            <ListItemText 
                                primary={<Typography fontWeight={700}>Last Activity</Typography>} 
                                secondary="Logged in from Mumbai, IN (Current Device)" 
                            />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Active Now</Typography>
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 4 }} />

                    {/* Notifications */}
                    <SectionHeading title="Notifications" />
                    <List disablePadding>
                        <ListItem sx={{ px: 0, py: 1 }}>
                            <ListItemText primary={<Typography fontWeight={600}>Email Notifications</Typography>} secondary="Weekly summaries and security alerts" />
                            <Switch checked={formData.emailNotifications} onChange={() => handleToggle('emailNotifications')} color="primary" />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 1 }}>
                            <ListItemText primary={<Typography fontWeight={600}>Investment Alerts</Typography>} secondary="Real-time alerts for price movements" />
                            <Switch checked={formData.investmentAlerts} onChange={() => handleToggle('investmentAlerts')} color="primary" />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 4 }} />

                    {/* Preferences */}
                    <SectionHeading title="Preferences" />
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body1" fontWeight={700}>Dark Mode</Typography>
                                <Typography variant="caption" color="text.secondary">Switch between light and dark interface</Typography>
                            </Box>
                            <Switch checked={formData.darkMode} onChange={() => handleToggle('darkMode')} color="primary" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Language</InputLabel>
                                <Select name="language" value={formData.language} label="Language" onChange={handleChange}>
                                    <MenuItem value="en">English (US)</MenuItem>
                                    <MenuItem value="hi">Hindi (हिन्दी)</MenuItem>
                                    <MenuItem value="ta">Tamil (தமிழ்)</MenuItem>
                                    <MenuItem value="te">Telugu (తెలుగు)</MenuItem>
                                    <MenuItem value="kn">Kannada (ಕನ್ನಡ)</MenuItem>
                                    <MenuItem value="es">Spanish (Español)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Currency</InputLabel>
                                <Select name="currency" value={formData.currency} label="Currency" onChange={handleChange}>
                                    <MenuItem value="INR">INR (₹) - Indian Rupee</MenuItem>
                                    <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
                                    <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
                                    <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
                                    <MenuItem value="JPY">JPY (¥) - Japanese Yen</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />

                    {/* FOOTER ACTIONS */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                            <Button 
                                fullWidth
                                variant="contained" 
                                onClick={handleSaveProfile} 
                                disabled={loading}
                                startIcon={<Save />}
                                sx={{ bgcolor: '#007DA3', borderRadius: 2, px: 5, py: 1.2, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#005b7a' } }}
                            >
                                Save Changes
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={onLogout}
                                startIcon={<Logout />}
                                sx={{ borderRadius: 2, px: 4, fontWeight: 700, textTransform: 'none' }}
                            >
                                Logout
                            </Button>
                        </Box>
                        <Button 
                            variant="text" 
                            color="error" 
                            startIcon={<DeleteForever />} 
                            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                        >
                            Delete My Account
                        </Button>
                    </Box>

                </CardContent>
            </Card>

            {/* Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800, color: '#007DA3', pt: 3 }}>Change Password</DialogTitle>
                <DialogContent>
                    {passStatus.msg && <Alert severity={passStatus.type} sx={{ mb: 2, mt: 1 }}>{passStatus.msg}</Alert>}
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField 
                            label="Current Password" type="password" fullWidth 
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                        <TextField 
                            label="New Password" type="password" fullWidth 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                        <TextField 
                            label="Confirm New Password" type="password" fullWidth 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 4 }}>
                    <Button onClick={() => setOpenPasswordDialog(false)} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handlePasswordChange} 
                        disabled={loading}
                        sx={{ bgcolor: '#007DA3', fontWeight: 700, borderRadius: 2, px: 4 }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Settings;
