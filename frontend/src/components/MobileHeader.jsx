import React, { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import AnimatedAlert from "../shared/AnimatedAlert.jsx"

const pages = ["機能", "アップデート", "お問い合わせ"]
const settings = ["プロフィール", "テーマ", "設定", "通知","アクセシビリティ", "サインアウト"]

function MobileHeader() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt_token"))
  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  useEffect(() => {
    const checkAuth = (event) => {
      if (event && event.key !== "jwt_token") return;
      const token = localStorage.getItem("jwt_token");
      setIsLoggedIn(!!token);
    };
  
    checkAuth();
    window.addEventListener("storage", checkAuth);
  
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    setIsLoggedIn(false)
    setShowAlert(true)
    navigate("/")
    setTimeout(() => setShowAlert(false), 3000);
  }

  const handleProtectedOption = (setting) => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    } else {
      if (setting === "プロフィール") {
        navigate("/dashboard");
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 3000);
      }
    }
  };  

  const handleTrollPagesClick = () => {
    setShowErrorAlert(true)
    setTimeout(() => {
      setShowErrorAlert(false)
    }, 3000)
  }

  return (
    <>
      <AnimatedAlert show={showAlert} severity="success" title="Success" message="ログアウトしました。" />

      <AnimatedAlert show={showErrorAlert} severity="error" title="Error" message="実装間に合わなかった；；" />
      <AppBar position="static" sx={{ backgroundImage: "linear-gradient(to right, #60519b, #31323e)" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <img
                src="/assets/image/logo192.png"
                alt="LOGO"
                onClick={() => navigate("/")}
                style={{ height: "40px", width: "auto", marginLeft: "8px", cursor: "pointer" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                navigate="/"
                sx={{
                  ml: 1,
                  fontFamily: "NotoSansJP, Arial, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Connectix
              </Typography>
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleTrollPagesClick}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>

            <Box sx={{ flexGrow: 0 }}>
              {!isLoggedIn ? (
                <Button
                  onClick={() => navigate("/sign-in")}
                  sx={{
                    color: "white",
                    fontFamily: "NotoSansJP, Arial, sans-serif",
                    fontSize: "14px",
                    textTransform: "none",
                  }}
                >
                  Sign In
                </Button>
              ) : (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              )}
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "サインアウト") {
                        handleLogout()
                      } else {
                        handleProtectedOption(setting)
                      }
                      handleCloseUserMenu()
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default MobileHeader