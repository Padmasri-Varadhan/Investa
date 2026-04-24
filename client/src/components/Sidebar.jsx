import React from 'react';
import {
    Box, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, Tooltip
} from '@mui/material';
import {
    TrendingUp, Dashboard, Lightbulb, Article,
    Flag, VideoLibrary, SmartToy, Map
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Sidebar navigation component
 * Matches design screenshot with teal-highlighted active item
 */
const navItems = [
    { label: 'Guided Journey', icon: <Map />, path: '/guided-journey' },
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Investment Ideas', icon: <Lightbulb />, path: '/investment-ideas' },
    { label: 'Articles', icon: <Article />, path: '/articles' },
    { label: 'My Goals', icon: <Flag />, path: '/my-goals' },
    { label: 'Video Advisory', icon: <VideoLibrary />, path: '/video-advisory' },
    { label: 'Chatbot', icon: <SmartToy />, path: '/chatbot' },
];

function Sidebar({ isCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                width: isCollapsed ? 64 : 220,
                position: 'fixed',
                top: 64,
                left: 0,
                height: 'calc(100vh - 64px)',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
                transition: 'width 0.2s ease',
                overflowX: 'hidden'
            }}
        >
            <List sx={{ pt: 1, pb: 2 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => window.location.href = item.path}
                                sx={{
                                    mx: isCollapsed ? 0.5 : 1,
                                    borderRadius: 2,
                                    py: 1,
                                    bgcolor: isActive ? '#e6f5fa' : 'transparent',
                                    color: isActive ? '#007DA3' : '#546e7a',
                                    '&:hover': {
                                        bgcolor: isActive ? '#e6f5fa' : '#f5f5f5',
                                        color: '#007DA3',
                                    },
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Tooltip title={isCollapsed ? item.label : ""} placement="right">
                                    <ListItemIcon
                                        sx={{
                                            minWidth: isCollapsed ? 0 : 36,
                                            mr: isCollapsed ? 0 : 0,
                                            justifyContent: 'center',
                                            color: isActive ? '#007DA3' : '#78909c',
                                        }}
                                    >
                                        {React.cloneElement(item.icon, { fontSize: 'small' })}
                                    </ListItemIcon>
                                </Tooltip>
                                {!isCollapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 700 : 500,
                                            fontFamily: 'Noto Sans, sans-serif',
                                        }}
                                    />
                                )}
                                {isActive && !isCollapsed && (
                                    <Box
                                        sx={{
                                            width: 4, height: 28, borderRadius: 2,
                                            bgcolor: '#007DA3', ml: 0.5,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Bottom brand info */}
            {!isCollapsed && (
                <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, px: 2 }}>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp sx={{ color: '#007DA3', fontSize: 18 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Investa v1.0
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default Sidebar;
