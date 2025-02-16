import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, IconButton, Typography, Button, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaletteIcon from "@mui/icons-material/Palette";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkList from "../components/LinkList.jsx";
import ThemeCustomizer from "../components/ThemeCustomizer.jsx";
import Analytics from "../components/Analytics.jsx";
import AnimatedAlert from "../shared/AnimatedAlert.jsx";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("links");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt_token"));
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState(""); // ✅ ユーザー名を管理する state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/forbidden");
    } else {
      // ✅ ユーザー名を取得
      fetchUsername(token);
    }
  }, []);

  // ✅ localStorage の変更を監視し、リアルタイムでログイン状態を更新
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("jwt_token"));
    };

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // ✅ ユーザー名を取得する関数
  const fetchUsername = async (token) => {
    try {
      // TODO
      const response = await fetch("http://localhost:3522/api/auth/usersname", {
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
      setUsername(data.username); // ✅ 取得したユーザー名を state に保存
    } catch (error) {
      console.error("ユーザー名取得エラー:", error);
    }
  };

  // ✅ ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setIsLoggedIn(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate("/"); // ✅ ログアウト後に `sign-in` へリダイレクト
    }, 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "links":
        return <LinkList />;
      case "theme":
        return <ThemeCustomizer />;
      case "analytics":
        return <Analytics />;
      default:
        return <LinkList />;
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
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
}