import React, { useState, useRef } from 'react';
import {
    Container, Typography, Box, Card, CardContent, Grid,
    TextField, Button, Switch, Avatar, Divider, Stack, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { updateUserProfile, changePassword } from '../services/api';

function Profile({ user, onLogout, onUpdateUser }) {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Dialogs state
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });

    const [openEmailDialog, setOpenEmailDialog] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState({ type: '', msg: '' });

    // Component state based on required layout structure
    const nameParts = (user?.name || '').split(' ');
    const fName = nameParts[0] || '';
    const lName = nameParts.slice(1).join(' ') || '';

    const [formData, setFormData] = useState({
        firstName: fName,
        lastName: lName,
        bio: user?.bio || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        twoStep: user?.twoStep || false,
        supportAccess: user?.supportAccess || false,
        aiAssistant: user?.aiAssistant || false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggle = (name) => {
        setFormData({ ...formData, [name]: !formData[name] });
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
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                bio: formData.bio,
                avatar: formData.avatar,
                email: formData.email,
                aiAssistant: formData.aiAssistant,
                twoStep: formData.twoStep,
                supportAccess: formData.supportAccess
            };
            const res = await updateUserProfile(payload);
            if (onUpdateUser) onUpdateUser(res.data);
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update profile' });
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

    const handleEmailChange = async () => {
        if (!newEmail || !newEmail.includes('@')) {
            setEmailStatus({ type: 'error', msg: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setEmailStatus({ type: '', msg: '' });
        try {
            const payload = { email: newEmail };
            const res = await updateUserProfile(payload);
            setFormData({ ...formData, email: newEmail });
            if (onUpdateUser) onUpdateUser(res.data);
            setEmailStatus({ type: 'success', msg: 'Email changed successfully!' });
            setTimeout(() => {
                setOpenEmailDialog(false);
                setEmailStatus({ type: '', msg: '' });
                setNewEmail('');
            }, 2000);
        } catch (err) {
            setEmailStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to change email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {status.msg && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

            <Stack spacing={4}>
                {/* 1. My Profile Section */}
                <Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>My Profile</Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Profile Image Row */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                                <Avatar 
                                    src={formData.avatar} 
                                    sx={{ width: 80, height: 80, fontSize: 32, fontWeight: 700, bgcolor: 'primary.main' }}
                                >
                                    {formData.firstName?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => fileInputRef.current.click()}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Change Image
                                    </Button>
                                    <Button 
                                        variant="text" 
                                        color="error" 
                                        onClick={() => setFormData({ ...formData, avatar: '' })}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Remove Image
                                    </Button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload} 
                                        style={{ display: 'none' }} 
                                        accept="image/*" 
                                    />
                                </Box>
                            </Box>

                            {/* Form Row */}
                            <Grid container spacing={3} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" fontWeight={600} mb={1}>First Name</Typography>
                                    <TextField 
                                        fullWidth 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" fontWeight={600} mb={1}>Last Name</Typography>
                                    <TextField 
                                        fullWidth 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" fontWeight={600} mb={1}>Bio</Typography>
                                    <TextField 
                                        fullWidth 
                                        multiline 
                                        rows={3} 
                                        name="bio" 
                                        value={formData.bio} 
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSave} 
                                    disabled={loading}
                                    sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* 2. Account Security Section */}
                <Box>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Email Address</Typography>
                                    <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setOpenEmailDialog(true)}
                                    sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160, height: 40 }}
                                >
                                    Change email
                                </Button>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Password</Typography>
                                    <Typography variant="body2" color="text.secondary">********</Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setOpenPasswordDialog(true)}
                                    sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160, height: 40 }}
                                >
                                    Change password
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* 3. Preferences Section */}
                <Box>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                                <Typography variant="body1" fontWeight={600}>Two-step verification</Typography>
                                <Switch 
                                    checked={formData.twoStep} 
                                    onChange={() => handleToggle('twoStep')} 
                                    color="primary" 
                                />
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Enable Chatbot</Typography>
                                    <Typography variant="body2" color="text.secondary">Turn on AI Assistant functionality and visibility.</Typography>
                                </Box>
                                <Switch 
                                    checked={formData.aiAssistant} 
                                    onChange={() => handleToggle('aiAssistant')} 
                                    color="primary" 
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* 4. Support Access Section */}
                <Box>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>Support access</Typography>
                                    <Typography variant="body2" color="text.secondary">Allow support teams to access your account temporarily for troubleshooting.</Typography>
                                </Box>
                                <Switch 
                                    checked={formData.supportAccess} 
                                    onChange={() => handleToggle('supportAccess')} 
                                    color="primary" 
                                />
                            </Box>
                            <Divider />
                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button 
                                    variant="text" 
                                    color="inherit" 
                                    onClick={onLogout}
                                    sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                                >
                                    Log out of all devices
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Delete account securely placed at bottom right */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="text" color="error" sx={{ textTransform: 'none', fontWeight: 600 }}>
                            Delete account
                        </Button>
                    </Box>
                </Box>
            </Stack>

            {/* Email Dialog */}
            <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle fontWeight={700}>Change Email Address</DialogTitle>
                <DialogContent>
                    {emailStatus.msg && <Alert severity={emailStatus.type} sx={{ mb: 2, mt: 1 }}>{emailStatus.msg}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            label="New Email Address" type="email" fullWidth 
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEmailDialog(false)} color="inherit">Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleEmailChange} 
                        disabled={loading}
                    >
                        Update Email
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Password Dialog */}
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
                        />
                        <TextField 
                            label="Confirm New Password" type="password" fullWidth 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenPasswordDialog(false)} color="inherit">Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handlePasswordChange} 
                        disabled={loading}
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Profile;
