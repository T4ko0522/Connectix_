import React, { useState, useEffect } from "react"
import { Container, TextField, Button, Typography, Box, Alert, Card, CardContent, LinearProgress, InputAdornment, IconButton, } from "@mui/material"
import { useLocation, Navigate } from "react-router-dom"
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material"
import { styled } from "@mui/system"

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
})

const StyledCard = styled(Card)({
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: "20px",
})

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [redirect, setRedirect] = useState(false) // 追加: リダイレクト用ステート

  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setRedirect(true) // トークンがなければ /forbidden にリダイレクト
    }
  }, [location])

  // リダイレクト判定
  if (redirect) {
    return <Navigate to="/forbidden" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません。")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("https://connectix-server.vercel.app/api/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      })

      const result = await response.json()
      if (response.ok) {
        setMessage(result.message)
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(result.message || "パスワードのリセットに失敗しました。")
      }
    } catch (error) {
      console.error("パスワードリセットエラー:", error)
      setError("サーバーエラーが発生しました。")
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <StyledCard>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <LockReset sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography component="h1" variant="h4" gutterBottom>
                新しいパスワードを設定
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                  {error}
                </Alert>
              )}
              {message && (
                <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
                  {message}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="新しいパスワード"
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="新しいパスワード（確認）"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                  パスワードを変更
                </Button>
                {loading && <LinearProgress />}
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </GradientBackground>
  )
}

export default ResetPassword