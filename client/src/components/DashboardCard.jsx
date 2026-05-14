import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, value, change, icon, children, titleColor }) => {
    return (
        <Card
            sx={{
                bgcolor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                p: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                height: '100%'
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: titleColor || '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {title}
                    </Typography>
                    {icon && <Box sx={{ color: '#6B7280' }}>{icon}</Box>}
                </Box>
                
                {value && (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                            {value}
                        </Typography>
                        {change && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 600, 
                                    color: change.startsWith('+') ? '#059669' : '#DC2626' 
                                }}
                            >
                                {change}
                            </Typography>
                        )}
                    </Box>
                )}
                
                {children && <Box sx={{ mt: 2 }}>{children}</Box>}
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
