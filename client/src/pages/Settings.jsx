import React, { useState, useRef } from 'react';
import {
    Container, Typography, Box, Card, CardContent, Grid,
    TextField, Button, Switch, FormControlLabel, Divider,
    Select, MenuItem, InputLabel, FormControl, Avatar,
    IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
    Alert, CircularProgress, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    PhotoCamera, Lock, Notifications, Language,
    Security, ExitToApp, VolumeUp, Category, Edit,
    SmartToy, Mic, Settings as SettingsIcon
} from '@mui/icons-material';
import { updateUserProfile, changePassword } from '../services/api';
import PageHeader from '../components/PageHeader';

function Settings({ user, onLogout, onUpdateUser }) {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    
    // Password state
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        bio: user?.bio || '',
        preferredLanguage: user?.preferredLanguage || 'English',
        interests: user?.interests || [],
        notifications: {
            blogUpdates: true,
            marketNews: true,
            aiSuggestions: true
        },
        voiceSearch: user?.voiceSearch || false,
        aiAssistant: user?.aiAssistant || false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitch = (e) => {
        const { name, checked } = e.target;
        if (name in formData.notifications) {
            setFormData({
                ...formData,
                notifications: { ...formData.notifications, [name]: checked }
            });
        } else {
            setFormData({ ...formData, [name]: checked });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setStatus({ type: '', msg: '' });



        try {
            const res = await updateUserProfile(formData);
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
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setOpenPasswordDialog(false), 2000);
        } catch (err) {
            setPassStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, fontFamily: "'Noto Sans', sans-serif" }}>
            <PageHeader 
                title="Settings" 
                subtitle="Manage your account preferences and security settings"
                icon={<SettingsIcon />}
            />

            {status.msg && <Alert severity={status.type} sx={{ mb: 3, borderRadius: 2 }}>{status.msg}</Alert>}

            <Grid container spacing={4}>
                {/* Profile and Security - Side by Side */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 1.5, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1} sx={{ fontFamily: "'Noto Sans', sans-serif" }}>
                                <Edit color="primary" /> Edit Profile
                            </Typography>
                            
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{ position: 'relative', mb: 1 }}>
                                        <Avatar src={formData.avatar} sx={{ width: 100, height: 100, bgcolor: '#007DA3', fontSize: 32, fontWeight: 700, border: '4px solid #fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                                            {user?.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{ 
                                                position: 'absolute', bottom: 0, right: 0, 
                                                bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                                                '&:hover': { bgcolor: '#f5f5f5' } 
                                            }}
                                        >
                                            <PhotoCamera fontSize="small" color="primary" />
                                        </IconButton>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Change Photo</Typography>
                                </Box>


                                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                <TextField fullWidth label="Email ID" name="email" value={formData.email} disabled />
                                <TextField fullWidth label="Bio" name="bio" value={formData.bio} onChange={handleChange} multiline rows={3} placeholder="Tell us about yourself..." />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 1.5, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1} sx={{ fontFamily: "'Noto Sans', sans-serif" }}>
                                <Lock color="primary" /> Security
                            </Typography>
                            
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Password Management</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>Secure your account by updating your password regularly.</Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setOpenPasswordDialog(true)}
                                    sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#007DA3' }}
                                >
                                    Change Password
                                </Button>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Privacy & Sessions</Typography>
                                <Typography variant="body2" color="text.secondary">Manage your two-factor authentication and active login sessions to keep your account safe.</Typography>
                                <Button size="small" sx={{ mt: 1, p: 0, textTransform: 'none', fontWeight: 600 }}>Privacy Settings & Policy</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Preferences Section */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} mb={4} display="flex" alignItems="center" gap={1.5} sx={{ fontFamily: "'Noto Sans', sans-serif" }}>
                                <Category color="primary" /> Preferences & Customization
                            </Typography>
                            
                            <Grid container spacing={4} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="lang-label" sx={{ bgcolor: 'white', px: 1 }}>Preferred Language</InputLabel>
                                        <Select 
                                            labelId="lang-label"
                                            name="preferredLanguage" 
                                            value={formData.preferredLanguage} 
                                            onChange={handleChange}
                                            label="Preferred Language"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="English">English</MenuItem>
                                            <MenuItem value="Spanish">Spanish</MenuItem>
                                            <MenuItem value="French">French</MenuItem>
                                            <MenuItem value="Hindi">Hindi</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="interests-label" sx={{ bgcolor: 'white', px: 1 }}>Investment Categories</InputLabel>
                                        <Select 
                                            labelId="interests-label"
                                            multiple 
                                            value={formData.interests} 
                                            label="Investment Categories" 
                                            onChange={(e) => setFormData({...formData, interests: e.target.value})}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="Stocks">Stocks</MenuItem>
                                            <MenuItem value="Mutual Funds">Mutual Funds</MenuItem>
                                            <MenuItem value="Gold">Gold</MenuItem>
                                            <MenuItem value="Crypto">Crypto</MenuItem>
                                            <MenuItem value="Real Estate">Real Estate</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                                        <Notifications fontSize="small" color="primary" /> Notification Preferences
                                    </Typography>
                                    <Stack spacing={1}>
                                        <FormControlLabel control={<Switch checked={formData.notifications.blogUpdates} onChange={handleSwitch} name="blogUpdates" />} label="New Blog Updates" />
                                        <FormControlLabel control={<Switch checked={formData.notifications.marketNews} onChange={handleSwitch} name="marketNews" />} label="Market News Alerts" />
                                        <FormControlLabel control={<Switch checked={formData.notifications.aiSuggestions} onChange={handleSwitch} name="aiSuggestions" />} label="AI Investment Suggestions" />
                                    </Stack>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={2}>
                                        <SmartToy fontSize="small" color="primary" /> AI & Voice Features
                                    </Typography>
                                    <Stack spacing={1}>
                                        <FormControlLabel 
                                            control={<Switch checked={formData.voiceSearch} onChange={handleSwitch} name="voiceSearch" />} 
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Mic fontSize="small" sx={{ opacity: 0.7 }} /> Enable Voice Search
                                                </Box>
                                            } 
                                        />
                                        <FormControlLabel 
                                            control={<Switch checked={formData.aiAssistant} onChange={handleSwitch} name="aiAssistant" />} 
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <SmartToy fontSize="small" sx={{ opacity: 0.7 }} /> Enable AI Personalized Assistant
                                                </Box>
                                            } 
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Save all button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            startIcon={<ExitToApp />} 
                            onClick={onLogout}
                            sx={{ borderRadius: 2, px: 4, textTransform: 'none' }}
                        >
                            Logout
                        </Button>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={handleSave}
                            disabled={loading}
                            sx={{ bgcolor: '#007DA3', borderRadius: 2, px: 8, fontWeight: 700, textTransform: 'none' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save All Changes'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={700}>Change Password</DialogTitle>
                <DialogContent>
                    {passStatus.msg && <Alert severity={passStatus.type} sx={{ mb: 2, mt: 1 }}>{passStatus.msg}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            label="Current Password" type="password" fullWidth 
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                        <TextField 
                            label="New Password" type="password" fullWidth 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            helperText="Minimum 8 characters"
                        />
                        <TextField 
                            label="Confirm New Password" type="password" fullWidth 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenPasswordDialog(false)} color="inherit">Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handlePasswordChange} 
                        disabled={loading}
                        sx={{ bgcolor: '#007DA3' }}
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Settings;
