import React, { useState } from "react"
import { Box, Stack, IconButton, Typography, Button, Avatar } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AddIcon from "@mui/icons-material/Add"
import BarChartIcon from "@mui/icons-material/BarChart"
import PaletteIcon from "@mui/icons-material/Palette"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import LinkList from "../components/LinkList.jsx"
import ThemeCustomizer from "../components/ThemeCustomizer.jsx"
import Analytics from "../components/Analytics.jsx"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("links")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "links":
        return <LinkList />
      case "theme":
        return <ThemeCustomizer />
      case "analytics":
        return <Analytics />
      default:
        return <LinkList />
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* サイドバー */}
      <Box
        sx={{
          width: { xs: isMobileMenuOpen ? "100%" : 0, md: 240 },
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          position: { xs: "fixed", md: "static" },
          height: "100vh",
          zIndex: 1200,
          transition: "width 0.3s",
          overflow: "hidden",
        }}
      >
        <Stack spacing={4} p={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                @username
              </Typography>
              <Typography variant="body2" color="text.secondary">
                lit.link/username
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Button
              startIcon={<AddIcon />}
              variant={activeTab === "links" ? "contained" : "text"}
              onClick={() => setActiveTab("links")}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              リンク管理
            </Button>
            <Button
              startIcon={<PaletteIcon />}
              variant={activeTab === "theme" ? "contained" : "text"}
              onClick={() => setActiveTab("theme")}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              テーマ設定
            </Button>
            <Button
              startIcon={<BarChartIcon />}
              variant={activeTab === "analytics" ? "contained" : "text"}
              onClick={() => setActiveTab("analytics")}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              アナリティクス
            </Button>
            <Button
              startIcon={<SettingsIcon />}
              variant={activeTab === "settings" ? "contained" : "text"}
              onClick={() => setActiveTab("settings")}
              fullWidth
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              設定
            </Button>
          </Stack>

          <Button startIcon={<LogoutIcon />} onClick={handleLogout} color="inherit" sx={{ mt: "auto", justifyContent: "flex-start", py: 1.5 }}>
            サインアウト
          </Button>
        </Stack>
      </Box>

      {/* メインコンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <IconButton sx={{ display: { md: "none" } }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {activeTab === "links" && "リンク管理"}
            {activeTab === "theme" && "テーマ設定"}
            {activeTab === "analytics" && "アナリティクス"}
            {activeTab === "settings" && "設定"}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>{renderContent()}</Box>
      </Box>
    </Box>
  )
}