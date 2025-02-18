import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import AppTheme from "../shared/AppTheme.jsx";
import { handleGoogleSignIn } from "../components/Auth.jsx";

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function MobileSignUp(props) {
  const { triggerAlert } = props
  const navigate = useNavigate()
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const [nameError, setNameError] = useState(false)
  const [nameErrorMessage, setNameErrorMessage] = useState("")

  const validateInputs = () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value

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

    if (!password || password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError(true)
      setPasswordErrorMessage("パスワードは12文字以上、大文字と数字を含めてください。")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    if (!name || name.length < 1) {
      setNameError(true)
      setNameErrorMessage("ユーザー名を入力してください。")
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage("")
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateInputs()) return

    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch("https://connectix-server.vercel.app/api/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.message === "このメールアドレスは既に登録されています。") {
          setEmailError(true)
          setEmailErrorMessage(result.message)
        } else if (result.message === "このユーザー名は既に使用されています。") {
          setNameError(true)
          setNameErrorMessage("このユーザー名は既に使用されています。")
        } else if (result.message === "このユーザー名は使用できません。") {
          setNameError(true)
          setNameErrorMessage("ユーザー名が3文字以下、または禁止ワードが含まれています。")
        }
        return
      }
      triggerAlert("info", "Verify", "認証メールを送信しました。メールを確認してください。")
      navigate("/sign-in") // サインイン画面へリダイレクト
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img
            src="./assets/image/logo512.png"
            alt="ロゴ"
            style={{ width: "80px", height: "80px", margin: "0 auto" }}
          />
          <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "1.75rem", textAlign: "center" }}>
            サインアップ
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">ユーザー名</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="ユーザー名を入力してください。"
                error={nameError}
                helperText={nameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="メールアドレス">メールアドレス</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="メールアドレスを入力してください。"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="パスワード">パスワード</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="パスワードを入力してください。"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              サインアップ
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />}>
              Googleでサインアップ
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("まだ未実装です。いずれ実装します。")}
              startIcon={<AppleIcon />}
            >
              Appleでサインアップ
            </Button>
            <Typography sx={{ textAlign: "center", fontSize: "0.875rem" }}>
              既にアカウントをお持ちの場合は{" "}
              <Link href="/sign-in" variant="body2" sx={{ alignSelf: "center" }}>
                こちらから。
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  )
}

MobileSignUp.propTypes = {
  triggerAlert: PropTypes.func.isRequired,
}