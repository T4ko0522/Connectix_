import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AnimatedAlert from '../shared/AnimatedAlert.jsx';
import Input from './Searchbox.jsx';
import Radio from './Setting.jsx';

const pages = ['機能', 'アップデート', 'お問い合わせ'];

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 追加
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleTrollPagesClick = () => {
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
  };

  return (
    <>
      <AnimatedAlert
        show={showErrorAlert}
        severity="error"
        title="Error"
        message="実装間に合わなかった；；"
      />
      <AppBar
        position="static"
        sx={{
          backgroundImage: 'linear-gradient(to right, #60519b, #31323e)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 15 }}>
              <img
                src="/assets/image/logo192.png"
                alt="LOGO"
                onClick={() => navigate("/")}
                style={{
                  height: '80px',
                  width: 'auto',
                  marginRight: '16px',
                  display: 'block',
                }}
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              navigate="/"
              sx={{
                mr: 8,
                ml: 0,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'NotoSansJP, Arial, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Connectix
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}> {/* ✅ alignItems: 'center' を追加 */}
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleTrollPagesClick}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    fontFamily: 'NotoSansJP, Arial, sans-serif',
                    fontSize: '16px',
                  }}
                >
                  {page}
                </Button>
              ))}
              <Box sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
              <Input />
              </Box>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {!isLoggedIn && (
                ['Sign Up', 'Sign In'].map((action) => (
                  <Button
                    key={action}
                    onClick={() =>
                      navigate(action === 'Sign In' ? '/sign-in' : '/sign-up')
                    }
                    sx={{
                      color: 'white',
                      fontFamily: 'NotoSansJP, Arial, sans-serif',
                      fontSize: '14px',
                      textTransform: 'none',
                      mx: 1,
                    }}
                  >
                    {action}
                  </Button>
                ))
              )}
              {isLoggedIn && (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <AccountCircleIcon style={{ fontSize: 45, color: 'white' }} />
                  </IconButton>
                </Tooltip>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    p: 0,
                    m: 0,
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    mt: "40px",
                  }
                }}
              >
                <Radio />
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Header;