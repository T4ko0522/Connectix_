import React, { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress  } from "@mui/material"
import PublishIcon from "@mui/icons-material/Publish"
import AnimatedAlert from "../shared/AnimatedAlert.jsx"

export function Settings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState("")
  // const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");

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
      //LINK - Local
      // const usernameResponse = await fetch("http://localhost:3522/api/auth/username", {
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
      // setShowAlert(true); // hrefだからalert等の全てが読み込み直されるため表示されない
      window.location.href = `https://connectix-xi.vercel.app/${username}`;
    } catch (err) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    } finally {
      setIsPublishing(false);
    }
  };  

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
      <AnimatedAlert
        show={showErrorAlert}
        severity="error"
        title="Error!"
        message={errorMessage}
      />
      {/* <AnimatedAlert
        show={showAlert}
        severity="success"
        title="Success!"
        message="プロフィールを公開しました！"
      /> */}
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
    </Box>
  )
}