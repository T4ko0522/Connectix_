import React, { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress, Snackbar, Alert } from "@mui/material"
// import SaveIcon from "@mui/icons-material/Save"
import PublishIcon from "@mui/icons-material/Publish"

export function Settings() {
  const [isLoading, setIsLoading] = useState(true)
  // const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load settings")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("認証トークンが存在しません。ログインしてください。");
      }
      // auth/username からユーザー名を取得
      const usernameResponse = await fetch("https://connectix-server.vercel.app/api/auth/username", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!usernameResponse.ok) {
        throw new Error("ユーザー名の取得に失敗しました");
      }
      const { username } = await usernameResponse.json();
      if (!username) {
        throw new Error("取得したユーザー名が不正です");
      }

      window.location.href = `https://connectix-xi.vercel.app/${username}`;
    } catch (err) {
      setSnackbar({ open: true, message: "プロフィール公開に失敗しました。", severity: "error" });
    } finally {
      setIsPublishing(false);
    }
  };  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Box className="flex justify-center items-center h-full text-red-500">{error}</Box>
  }

  return (
    <Box className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="mb-6">
        プロフィール設定
      </Typography>

      {/* ✅ 説明文の下に間隔を追加 */}
      <Typography variant="body1" sx={{ mt: 4, mb: 4 }}>
        プロフィール設定、テーマのカスタマイズ、リンクをしてプロフィールを公開するには、下のボタンを使用してください。
      </Typography>

      {/* ✅ ボタンの間隔を追加 */}
      <Box className="space-y-6">
        <Box className="flex flex-col sm:flex-row justify-between gap-4">
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
            fullWidth
            sx={{ height: 48, mt: 2 }}
          >
            {isSaving ? "保存中..." : "すべての設定を保存する"}
          </Button> */}
        </Box>
        <Box className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
            disabled={isPublishing}
            fullWidth
            sx={{ height: 48, mt: 2 }}
          >
            {isPublishing ? "公開中..." : "プロフィールを公開する"}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // ✅ ここを3秒に設定
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}