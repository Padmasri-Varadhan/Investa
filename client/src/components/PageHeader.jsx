import React from 'react';
import { Box, Card, Typography } from '@mui/material';

/**
 * Standardized Page Header Component
 * Enforces consistency across the application.
 */
const PageHeader = ({ title, subtitle, icon, action }) => {
    return (
        <Card 
            elevation={0}
            sx={{ 
                mb: 6, 
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Box sx={{ p: { xs: 4, md: 5 }, position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {icon && (
                        <Box sx={{ 
                            bgcolor: '#e6f5fa', 
                            p: 2, 
                            borderRadius: '16px', 
                            display: 'flex',
                            boxShadow: '0 8px 16px -4px rgba(0, 125, 163, 0.1)'
                        }}>
                            {React.cloneElement(icon, { sx: { color: '#007DA3', fontSize: 32 } })}
                        </Box>
                    )}
                    <Box>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 900, 
                                color: '#1e293b',
                                letterSpacing: -1,
                                fontSize: { xs: '1.75rem', md: '2.5rem' }
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    color: '#64748b', 
                                    fontWeight: 500,
                                    mt: 0.5,
                                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                                    maxWidth: '700px'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {action && <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{action}</Box>}
            </Box>
        </Card>
    );
};

export default PageHeader;
