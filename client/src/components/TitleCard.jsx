import React from 'react';
import { Box, Typography } from '@mui/material';

const TitleCard = ({ title, subtitle, action }) => {
    return (
        <Box 
            sx={{ 
                width: '100%',
                bgcolor: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                px: 6,
                py: 4,
                mb: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignment: 'center'
            }}
        >
            <Box>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 700, 
                        color: '#111827',
                        fontSize: { xs: '1.5rem', md: '1.875rem' } 
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography 
                        variant="body1" 
                        sx={{ color: '#6B7280', mt: 1 }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {action && <Box>{action}</Box>}
        </Box>
    );
};

export default TitleCard;
