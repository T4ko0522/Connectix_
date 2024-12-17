import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(to right, #60519b, #31323e)', // グラデーション背景
        color: 'white',
        height: '60px',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">
        2024 Copyright © Connectix
      </Typography>
    </Box>
  );
};

export default Footer;
