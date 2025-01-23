import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import MenuItem from '@mui/material/MenuItem';
import AnimatedAlert from '../shared/AnimatedAlert.js';

const pages = ['機能', 'アップデート', 'お問い合わせ'];

function Header() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const settings = ['プロフィール', 'アカウント', '詳細設定', 'サインアウト'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate('/');
    }, 3000); // 3秒後に非表示
  };

  const handleProtectedOption = (setting) => {
    if (!isLoggedIn) {
      navigate('/sign-in');
    } else {
      console.log(`${setting} を選択しました`);
    }
  };

  return (
    <>
      <AnimatedAlert
        show={showAlert}
        severity="success"
        title="Success"
        message="ログアウトしました。"
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
              href="/"
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
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
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
                sx={{ mt: '45px' }}
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
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === 'サインアウト') {
                        handleLogout();
                      } else {
                        handleProtectedOption(setting);
                      }
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Header;