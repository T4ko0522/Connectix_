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
import AnimatedAlert from '../shared/AnimatedAlert.jsx';
import Input from './Serchbox.jsx';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import Setting from './setting.jsx';

const pages = ['機能', 'アップデート', 'お問い合わせ'];

function Header() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token')); // ✅ 修正
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const settings = ['プロフィール', 'アカウント', '詳細設定', 'サインアウト'];
  const [anchorElNav, setAnchorElNav] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    const checkAuth = (event) => {
      if (event && event.key !== 'jwt_token') return; // ✅ jwt_token の変更のみ監視
      const token = localStorage.getItem('jwt_token');
      setIsLoggedIn(!!token);
    };    
    checkAuth(); // 初回実行
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // 3秒後に非表示
  };
  const handleProtectedOption = (setting) => {
    if (!isLoggedIn) {
      navigate('/sign-in');
    } else {
      console.log(`${setting} を選択しました`);
    }
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
        show={showAlert}
        severity="success"
        title="Success"
        message="ログアウトしました。"
      />

      <AnimatedAlert
        show={showErrorAlert}
        severity="error"
        title="エラー"
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
      {isMobile && (
        <AppBar
          position="static"
          sx={{
            backgroundImage: 'linear-gradient(to right, #60519b, #31323e)',
            color: 'white',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <img
                  src="/assets/image/logo192.png"
                  alt="LOGO"
                  onClick={() => navigate("/")}
                  style={{
                    height: '50px',
                    width: 'auto',
                    marginRight: '16px',
                    display: 'block',
                  }}
                />
              </Box>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
}

export default Header;