import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, IconButton, Typography, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaletteIcon from "@mui/icons-material/Palette";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LinkList from "../components/LinkList.jsx";
import ThemeCustomizer from "../components/ThemeCustomizer.jsx";
import Analytics from "../components/Analytics.jsx";
import { Settings } from "../components/Settings.jsx";
import AnimatedAlert from "../shared/AnimatedAlert.jsx";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("links");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt_token"));
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [links, setLinks] = useState([]);
  const [themeSettings, setThemeSettings] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/forbidden");
    } else {
      fetchUsername(token);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("jwt_token"));
    };

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // 🔹 ページを離れるときに警告を表示
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "変更が保存されていません。本当に離れますか？";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const fetchUsername = async (token) => {
    try {
      // TODO
      // const response = await fetch("http://localhost:3522/api/auth/usersname", {
      const response = await fetch("https://connectix-server.vercel.app/api/auth/username", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("ユーザー名の取得に失敗しました");
      }

      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error("ユーザー名取得エラー:", error);
    }
  };

  // 🔹 タブ変更時の確認ダイアログを表示
  // const handleTabChange = (newTab) => {
  //   if (hasUnsavedChanges) {
  //     setPendingNavigation(() => () => setActiveTab(newTab));
  //     setOpenConfirmDialog(true);
  //     return;
  //   }
  //   setActiveTab(newTab);
  // };

  // 🔹 確認ダイアログで「変更を破棄」した場合の処理
  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setOpenConfirmDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  // 🔹 ナビゲーション (外部ページへ移動) の警告処理
  const handleNavigate = (path) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => navigate(path));
      setOpenConfirmDialog(true);
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    handleNavigate("/");
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "links":
        return <LinkList 
                  links={links} 
                  setLinks={setLinks}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />;
      case "theme":
        return (
          <ThemeCustomizer
            setHasUnsavedChanges={setHasUnsavedChanges}
            links={links}
            themeSettings={themeSettings}
            setThemeSettings={setThemeSettings}
          />
        );
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />
      default:
        return <LinkList links={links} setLinks={setLinks} />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* ✅ ログアウト通知 */}
      <AnimatedAlert
        show={showAlert}
        severity="success"
        title="Success"
        message="ログアウトしました。"
      />
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>未保存の変更があります</DialogTitle>
        <DialogContent>
          <Typography>変更を破棄して移動しますか？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>キャンセル</Button>
          <Button onClick={handleDiscardChanges} color="error">
            破棄する
          </Button>
        </DialogActions>
      </Dialog>
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
                @{username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              connectix-xi.vercel.app/{username}
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
          {/* ✅ ログアウトボタン */}
          {isLoggedIn && (
            <Button startIcon={<LogoutIcon />} onClick={handleLogout} color="inherit" sx={{ mt: "auto", justifyContent: "flex-start", py: 1.5 }}>
              サインアウト
            </Button>
          )}
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
  );
}