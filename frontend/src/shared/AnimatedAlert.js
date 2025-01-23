import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const AnimatedAlert = ({ show, severity, title, message }) => {
  // severityに応じた文字色と背景色を設定
  const colors = {
    success: { text: '#2e7d32', background: '#c8e6c9' }, // 成功時: 緑
    info: { text: '#1565c0', background: '#bbdefb' },    // 情報時: 青
    warning: { text: '#f57c00', background: '#ffe0b2' }, // 警告時: 黄
    error: { text: '#c62828', background: '#ffcdd2' },   // エラー時: 赤
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1201,
        transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
        transform: show ? 'translateX(0)' : 'translateX(100%)',
        opacity: show ? 1 : 0,
        width: '300px',
      }}
    >
      <Alert
        severity={severity}
        sx={{
          backgroundColor: colors[severity]?.background || '#ffffff',
          color: colors[severity]?.text || '#000000',
          borderColor: colors[severity]?.text || '#000000',
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

AnimatedAlert.propTypes = {
  show: PropTypes.bool.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default AnimatedAlert;