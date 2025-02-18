import React, {useState} from "react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import CssBaseline from "@mui/material/CssBaseline"
import FormControlLabel from "@mui/material/FormControlLabel"
import Divider from "@mui/material/Divider"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"
import { styled } from "@mui/material/styles"
import ForgotPassword from "./ForgotPassword.jsx"
import GoogleIcon from "@mui/icons-material/Google"
import AppleIcon from "@mui/icons-material/Apple"
import AppTheme from "../shared/AppTheme.jsx"
import { handleGoogleSignIn } from "../components/Auth.jsx"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "none",
  background: "transparent",
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  height: "auto",
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}))

export default function MobileSignIn(props) {
  const { triggerAlert } = props
  const navigate = useNavigate()
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const validateInputs = () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    let isValid = true
    if (
      !email ||
      !/^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z]{2})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(
        email,
      )
    ) {
      setEmailError(true)
      setEmailErrorMessage("有効なメールアドレスを入力してください。")
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage("")
    }

    if (!password || password.length < 12) {
      setPasswordError(true)
      setPasswordErrorMessage("パスワードは12文字以上に設定してください。")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateInputs()) return

    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch("https://connectix-server.vercel.app/api/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.message.includes("未認証")) {
          triggerAlert("error", "failed", "メール認証が完了していません。認証メールを確認してください。")
          return
        }
        throw new Error(result.message || "サインインに失敗しました")
      }

      if (result.token) {
        localStorage.setItem("jwt_token", result.token)
        triggerAlert("success", "成功", "サインイン成功しました！")
        navigate("/")
      } else {
        triggerAlert("error", "失敗", "JWTの取得に失敗しました。")
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img
            src="./assets/image/logo512.png"
            alt="ロゴ"
            style={{ width: "80px", height: "80px", margin: "0 auto" }}
          />
          <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "1.75rem", textAlign: "center" }}>
            サインイン
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">メールアドレス</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="メールアドレスを入力してください。"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="パスワードを入力してください。"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="サインイン状態を維持" />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
              サインイン
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              パスワードを忘れましたか？
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />}>
              Googleでサインイン
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("まだ未実装です。いずれ実装します。")}
              startIcon={<AppleIcon />}
            >
              Appleでサインイン
            </Button>
            <Typography sx={{ textAlign: "center", fontSize: "0.875rem" }}>
              アカウントをお持ちでない場合は{" "}
              <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
                Connectixに登録する
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}

MobileSignIn.propTypes = {
  triggerAlert: PropTypes.func.isRequired,
}