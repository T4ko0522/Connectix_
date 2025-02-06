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
      <Typography
        variant="h3"
        sx={{
          mr: 8,
          ml: 0,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'RobotoCondensed-Italic, RobotoCondensed, NotoSansJP, Arial, sans-serif',
          fontSize: '15px',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        Copyright (C) 2025 Connectix. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;