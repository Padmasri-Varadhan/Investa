import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, InputBase,
    Box, Avatar, Badge, Menu, MenuItem, Tooltip, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Button, FormControl, InputLabel, Select, CircularProgress, Alert, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
    Menu as MenuIcon, Search as SearchIcon, Notifications,
    Settings, Help, ExitToApp, Edit, ExpandMore, Email as EmailIcon, Article as ArticleIcon, Security, LiveHelp, Close as CloseIcon, Mic
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../App';
import { updateUserProfile, markNotificationRead } from '../services/api';
import { Brightness4, Brightness7, Lock, Language, PhotoCamera } from '@mui/icons-material';

/**
 * Top Navbar Component
 */
function Navbar({ user, onLogout, onUpdateUser, toggleSidebar }) {
    const navigate = useNavigate();
    const { mode, toggleColorMode } = React.useContext(ColorModeContext);

    // Menus states
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);
    const [helpOpen, setHelpOpen] = useState(false);

    // Edit Profile/Settings state
    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', avatar: '', preferredLanguage: 'English' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
    const handleProfileClose = () => setProfileAnchor(null);

    const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
    const handleNotifClose = () => setNotifAnchor(null);

    const handleHelpOpen = () => setHelpOpen(true);
    const handleHelpClose = () => setHelpOpen(false);

    const handleLogout = () => {
        handleProfileClose();
        onLogout();
        window.location.href = '/';
    };

    const handleEditOpen = () => {
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            avatar: user.avatar || '',
            preferredLanguage: user.preferredLanguage || 'English'
        });
        setEditError('');
        setEditOpen(true);
        handleProfileClose();
    };

    const handleEditClose = () => setEditOpen(false);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError('');
        try {
            const res = await updateUserProfile(editForm);
            if (onUpdateUser) onUpdateUser(res.data);
            setEditOpen(false);
            if (user.preferredLanguage !== res.data.preferredLanguage) {
                window.location.reload();
            }
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setEditLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = searchQuery.trim();
            if (!query) {
                alert('Please enter a search keyword');
                return;
            }
            navigate(`/articles?search=${encodeURIComponent(query)}`);
            setSearchQuery('');
        }
    };

    const handleMarkAsRead = async (notif) => {
        if (notif.read) {
            if (notif.link) {
                handleNotifClose();
                navigate(notif.link);
            }
            return;
        }

        try {
            const res = await markNotificationRead(notif._id);
            if (onUpdateUser) onUpdateUser(res.data);
            if (notif.link) {
                handleNotifClose();
                navigate(notif.link);
            }
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: '#FFFFFF',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important', px: 2 }}>
                    {/* Brand & Toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                        <IconButton onClick={toggleSidebar} sx={{ color: '#007DA3' }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 800, letterSpacing: 0.5, color: '#007DA3', cursor: 'pointer' }}
                            onClick={() => window.location.href = user ? '/guided-journey' : '/'}
                        >
                            Investa
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    {/* Search Bar */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' }, alignItems: 'center',
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            px: 1.5, py: 0.5,
                            mr: 2, minWidth: 280,
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <SearchIcon sx={{ color: '#007DA3', fontSize: 18, mr: 1 }} />
                        <InputBase
                            placeholder="Search investments, articles..."
                            sx={{ color: '#333', fontSize: 14, width: '100%' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        {user?.voiceSearch && (
                            <IconButton size="small" sx={{ color: '#007DA3' }} onClick={() => alert('Voice search activated! Listening...')}>
                                <Mic sx={{ fontSize: 20 }} />
                            </IconButton>
                        )}
                    </Box>

                    {/* Action Icons */}
                    <Tooltip title="Notifications">
                        <IconButton sx={{ color: '#007DA3', mr: 0.5 }} onClick={handleNotifOpen}>
                            <Badge badgeContent={unreadCount} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton sx={{ color: '#007DA3', mr: 0.5 }} onClick={() => navigate('/settings')}>
                            <Settings />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Help">
                        <IconButton sx={{ color: '#007DA3', mr: 1 }} onClick={handleHelpOpen}>
                            <Help />
                        </IconButton>
                    </Tooltip>

                    {/* User Profile Trigger */}
                    <Tooltip title="Profile">
                        <Avatar
                            onClick={() => navigate('/profile')}
                            src={user?.avatar}
                            sx={{
                                bgcolor: '#007DA3', width: 38, height: 38,
                                cursor: 'default', fontWeight: 700, fontSize: 14,
                                border: '2px solid #e6f5fa',
                                '&:hover': { border: '2px solid #007DA3' },
                            }}
                        >
                            {getInitials(user?.name)}
                        </Avatar>
                    </Tooltip>

                    {/* Profile Panel Menu */}
                    <Menu
                        anchorEl={profileAnchor}
                        open={Boolean(profileAnchor)}
                        onClose={handleProfileClose}
                        PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 260, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 3, py: 3, textAlign: 'center' }}>
                            <Avatar
                                src={user?.avatar || ''}
                                sx={{ width: 70, height: 70, mx: 'auto', mb: 1.5, bgcolor: '#007DA3', fontSize: 24, fontWeight: 700 }}
                            >
                                {getInitials(user?.name)}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1a2332' }}>{user?.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                startIcon={<Security />}
                                onClick={() => window.open('https://investa.com/privacy', '_blank')}
                                sx={{ borderRadius: 3, textTransform: 'none', color: '#007DA3', borderColor: '#007DA3' }}
                            >
                                Privacy Policy
                            </Button>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }} sx={{ py: 1.5, gap: 1.5 }}>
                            <Edit fontSize="small" sx={{ color: '#007DA3' }} />
                            <Typography variant="body2" fontWeight={600}>Settings</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}>
                            <ExitToApp fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>Sign Out</Typography>
                        </MenuItem>
                    </Menu>

                    {/* Notifications Panel */}
                    <Menu
                        anchorEl={notifAnchor}
                        open={Boolean(notifAnchor)}
                        onClose={handleNotifClose}
                        PaperProps={{ sx: { mt: 1, borderRadius: 3, width: 320, maxHeight: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" fontWeight={800}>Notifications</Typography>
                            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 700 }} onClick={() => alert('All notifications marked as read!')}>Mark all as read</Typography>
                        </Box>
                        <Divider />
                        <List sx={{ p: 0 }}>
                            {user?.notifications && user.notifications.length > 0 ? (
                                [...user.notifications].reverse().map((notif) => (
                                    <ListItem 
                                        button 
                                        key={notif._id} 
                                        onClick={() => handleMarkAsRead(notif)} 
                                        sx={{ 
                                            py: 1.5, 
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: notif.read ? 'transparent' : 'rgba(0, 125, 163, 0.05)'
                                        }}
                                    >
                                        <ListItemText
                                            primary={notif.title}
                                            secondary={notif.message}
                                            primaryTypographyProps={{ 
                                                fontSize: 13, 
                                                fontWeight: notif.read ? 600 : 800,
                                                color: notif.read ? 'text.secondary' : 'text.primary'
                                            }}
                                            secondaryTypographyProps={{ fontSize: 12 }}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">No notifications</Typography>
                                </Box>
                            )}
                        </List>
                        <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f9f9f9' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#007DA3', cursor: 'pointer' }} onClick={() => { handleNotifClose(); navigate('/articles'); }}>View all news</Typography>
                        </Box>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Help & FAQ Dialog */}
            <Dialog open={helpOpen} onClose={handleHelpClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8f9fa', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Help & Support
                    <IconButton onClick={handleHelpClose} size="small" sx={{ color: '#666', '&:hover': { color: 'error.main' } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ArticleIcon sx={{ color: '#007DA3' }} /> Product Overview
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Investa is your all-in-one companion for financial growth. Use the **Guided Journey** to learn step-by-step,
                            track your assets in the **Dashboard**, and get AI-powered insights from our **Chatbot**.
                        </Typography>

                        <Typography variant="subtitle1" fontWeight={700} mt={3} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ color: '#007DA3' }} /> Contact Support
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Need help? Contact our admin team at:
                            <Box component="span" sx={{ fontWeight: 700, color: '#007DA3', ml: 1 }}>support@investa.com</Box>
                        </Typography>
                    </Box>

                    <Box sx={{ px: 3, pb: 4 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LiveHelp sx={{ color: '#007DA3' }} /> Frequently Asked Questions
                        </Typography>
                        {[
                            { q: "What is Investa?", a: "Investa is a financial education and investment tracking platform designed for all skill levels." },
                            { q: "How do I start investing?", a: "Start with our 'Guided Journey' module which teaches you the basics of stock markets and ETFs." },
                            { q: "Is my data secure?", a: "Yes, we use industry-standard encryption to protect your personal and financial data." },
                            { q: "How do I set financial goals?", a: "Navigate to 'My Goals' section and click 'Add Goal' to set targets for savings or investments." },
                            { q: "What are investment articles?", a: "These are curated deep-dives into market trends, asset classes, and financial strategies." },
                            { q: "Can I chat with an advisor?", a: "Our AI Chatbot is available 24/7. For human support, please email our admin team." },
                            { q: "What is the Guided Journey?", a: "It's a step-by-step learning path that takes you from beginner to advanced investment concepts." },
                            { q: "How do I change my theme?", a: "Go to Settings and toggle between Light and Dark mode." },
                            { q: "Is Investa free to use?", a: "The basic educational features are free. Premium advisory might have separate terms." },
                            { q: "How do I contact support?", a: "You can email us at support@investa.com or use the contact form in the Help section." }
                        ].map((faq, i) => (
                            <Accordion key={i} elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #eee' }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="body2" fontWeight={600}>{faq.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}>Settings</DialogTitle>
                <form onSubmit={handleEditSubmit}>
                    <DialogContent sx={{ px: 3 }}>
                        {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>Edit User Information</Typography>

                            <TextField
                                fullWidth label="Username" name="name"
                                value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                required size="small"
                            />

                            <TextField
                                fullWidth label="Email Address" name="email" type="email"
                                value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                required size="small"
                                disabled
                            />

                            <TextField
                                fullWidth label="Profile Picture URL" name="avatar"
                                value={editForm.avatar} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                                size="small" placeholder="https://example.com/photo.jpg"
                                InputProps={{ startAdornment: <PhotoCamera sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                            />

                            <Divider />

                            <Typography variant="overline" color="text.secondary" fontWeight={700}>Appearance & Language</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8f9fa', p: 1.5, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {mode === 'dark' ? <Brightness7 fontSize="small" sx={{ color: '#007DA3' }} /> : <Brightness4 fontSize="small" sx={{ color: '#007DA3' }} />}
                                    <Typography variant="body2" fontWeight={600}>Theme Selection</Typography>
                                </Box>
                                <Button
                                    size="small"
                                    onClick={toggleColorMode}
                                    variant="outlined"
                                    sx={{ borderRadius: 3, textTransform: 'none', color: '#007DA3', borderColor: '#007DA3' }}
                                >
                                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </Button>
                            </Box>

                            <FormControl fullWidth size="small">
                                <InputLabel>Language Selection</InputLabel>
                                <Select
                                    name="preferredLanguage"
                                    value={editForm.preferredLanguage}
                                    onChange={(e) => setEditForm({ ...editForm, preferredLanguage: e.target.value })}
                                    label="Language Selection"
                                    startAdornment={<Language sx={{ color: '#007DA3', mr: 1, fontSize: 20 }} />}
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
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button onClick={handleEditClose} color="inherit" fullWidth sx={{ borderRadius: 3 }}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={editLoading} fullWidth sx={{ borderRadius: 3, bgcolor: '#007DA3' }}>
                            {editLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default Navbar;
