import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper, CircularProgress, Snackbar, Alert } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkIcon from "@mui/icons-material/Link";

const VRChatIcon = () => (
  <img
    src="/assets/image/VRChat.png"
    alt="VRChat Icon"
    style={{ width: 24, height: 24 }}
  />
);

const getIcon = (type, customIcon) => {
  if (customIcon) {
    return (
      <img
        src={customIcon}
        alt="Custom Icon"
        style={{ width: 24, height: 24, borderRadius: "50%" }}
      />
    );
  }
  switch (type) {
    case "instagram":
      return <InstagramIcon />;
    case "twitter":
      return <TwitterIcon />;
    case "youtube":
      return <YouTubeIcon />;
    case "vrchat":
      return <VRChatIcon />;
    default:
      return <LinkIcon />;
  }
};

export default function PreviewPublicProfile() {
  const [theme, setTheme] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // 背景の決定：背景画像があればそれ、なければグラデーション or 単色
  const getCurrentBackground = () => {
    if (theme && theme.background_image) {
      return `url(${theme.background_image})`;
    }
    if (theme && theme.is_gradient) {
      return `linear-gradient(45deg, ${theme.primary_color}, ${theme.secondary_color})`;
    }
    return theme ? theme.primary_color : "#ffffff";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("ログインが必要です");
        }

        // まずユーザー名を取得
        const usernameResponse = await fetch(
          "https://connectix-server.vercel.app/api/auth/username",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!usernameResponse.ok) {
          throw new Error("ユーザー名の取得に失敗しました");
        }
        const { username } = await usernameResponse.json();

        // 次にそのユーザーのプロフィールを取得
        const response = await fetch(
          `https://connectix-server.vercel.app/api/public-profile/${username}`
        );
        if (!response.ok) {
          throw new Error("プロフィールの取得に失敗しました");
        }
        const data = await response.json();
        setTheme(data.themeSettings);
        setLinks(data.links);
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("プロフィールURLのコピーに失敗しました:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!theme) {
    return <Navigate to="/404" />;
  }

  return (
    <Box
      sx={{
        background: getCurrentBackground(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper
        sx={{
          maxWidth: 380,
          mx: "auto",
          p: 3,
          textAlign: "center",
          bgcolor: "transparent",
        }}
      >
        {/* プロフィール画像 */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "#eee",
            backgroundImage: theme.profile_image
              ? `url(${theme.profile_image})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mx: "auto",
            border: `3px solid ${theme.username_font_color}`,
          }}
        />
        {/* ユーザー名 */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: theme.username_font_color, mt: 2 }}
        >
          {theme.display_username}
        </Typography>
        {/* リンク一覧 */}
        <Stack spacing={2} sx={{ width: "100%", mt: 3 }}>
          {links.map((link) => (
            <Button
              key={link.id}
              variant="contained"
              startIcon={getIcon(link.type, link.custom_icon)}
              fullWidth
              onClick={() => (window.location.href = link.url)}
              sx={{
                background: theme.is_link_background_transparent
                  ? "transparent"
                  : theme.is_link_background_gradient
                  ? `linear-gradient(45deg, ${theme.link_background_color}, ${theme.link_background_secondary_color})`
                  : theme.link_background_color,
                color: theme.url_font_color,
                textTransform: "none",
                py: 1.5,
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {link.title}
            </Button>
          ))}
        </Stack>
        {/* プロフィールをシェアするボタン */}
        <Button variant="outlined" sx={{ mt: 3 }} onClick={handleShareProfile}>
          プロフィールをシェアする
        </Button>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          プロフィールURLをコピーしました！
        </Alert>
      </Snackbar>
    </Box>
  );
}