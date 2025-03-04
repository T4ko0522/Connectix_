import React, { useState, useEffect } from "react"
import { Stack, Paper, Typography, Box, Grid, Button, Switch, FormControlLabel, Slider } from "@mui/material"
import { MuiColorInput } from "mui-color-input"
import InstagramIcon from "@mui/icons-material/Instagram"
import TwitterIcon from "@mui/icons-material/Twitter"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LinkIcon from "@mui/icons-material/Link"
import ImageIcon from "@mui/icons-material/Image"
import SaveIcon from "@mui/icons-material/Save"
import PropTypes from "prop-types"
import AnimatedAlert from "../shared/AnimatedAlert.jsx"

export default function ThemeCustomizer({ setHasUnsavedChanges }) {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGradient, setIsGradient] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#E91E63");
  const [usernameFontColor, setUsernameFontColor] = useState("#000000");
  const [urlFontColor, setUrlFontColor] = useState("#000000");
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLinkBackgroundTransparent, setIsLinkBackgroundTransparent] = useState(false);
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("#FFFFFF");
  const [linkBackgroundSecondaryColor, setLinkBackgroundSecondaryColor] = useState("#FFFFFF");
  const [isLinkBackgroundGradient, setIsLinkBackgroundGradient] = useState(false);
  const [username, setUsername] = useState("@username");
  const [hasUnsavedChangesLocal, setHasUnsavedChangesLocal] = useState(false);
  const [links, setLinks] = useState([]);
  const [linkBackgroundOpacity, setLinkBackgroundOpacity] = useState(0.5);
  const VRChatIcon = () => <img src="assets/image/VRChat.png" alt="VRChat Icon" style={{ width: 24, height: 24 }} />;
  const handleChange = () => {
    setHasUnsavedChangesLocal(true);
    setHasUnsavedChanges(true);
  };  

  useEffect(() => {
    const savedLinks = localStorage.getItem("savedLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }

    const handleStorageChange = () => {
      const updatedLinks = localStorage.getItem("savedLinks");
      if (updatedLinks) {
        setLinks(JSON.parse(updatedLinks));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("認証トークンが存在しません。ログインしてください。");
        }
        //LINK - Local
        // const response = await fetch("http://localhost:3522/api/theme-settings", {
        const response = await fetch("https://connectix-server.vercel.app/api/theme-settings", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.settings) {
          setIsGradient(data.settings.is_gradient);
          setPrimaryColor(data.settings.primary_color);
          setSecondaryColor(data.settings.secondary_color);
          setUsernameFontColor(data.settings.username_font_color);
          setUrlFontColor(data.settings.url_font_color);
          setProfileImage(data.settings.profile_image);
          setBackgroundImage(data.settings.background_image);
          setIsLinkBackgroundTransparent(data.settings.is_link_background_transparent);
          setLinkBackgroundColor(data.settings.link_background_color);
          setLinkBackgroundSecondaryColor(data.settings.link_background_secondary_color);
          setIsLinkBackgroundGradient(data.settings.is_link_background_gradient);
          setUsername(data.settings.display_username);
          // ここから透過度設定の反映
          if (data.settings.link_background_opacity !== undefined) {
            setLinkBackgroundOpacity(data.settings.link_background_opacity);
          }
        }
      } catch (error) {
        console.error("テーマ設定取得エラー:", error);
      }
    };

    fetchThemeSettings();
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("認証トークンが存在しません。ログインしてください。");
        }
        const response = await fetch("https://connectix-server.vercel.app/api/links", {
        // const response = await fetch("http://localhost:3522/api/links", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("リンクの取得に失敗しました");
        }
        const data = await response.json();
        // API からのレスポンスの custom_icon を customIcon に変換
        const transformed = data.links.map(link => ({
          ...link,
          customIcon: link.custom_icon,
        }));
        setLinks(transformed);
      } catch (error) {
        console.error("リンクの取得エラー:", error);
      }
    };
  
    fetchLinks();
  }, []);  

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChangesLocal) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChangesLocal])

  //ANCHOR - テーマを保存する関数
  const saveSettings = async () => {
    const settings = {
      displayUsername: username, // ここはユーザーが入力した表示用の名前（例えば username 状態変数を displayUsername に変更するなど）
      is_gradient: isGradient ?? false,
      primary_color: primaryColor ?? "#ffffff",
      secondary_color: secondaryColor ?? "#E91E63",
      username_font_color: usernameFontColor ?? "#000000",
      url_font_color: urlFontColor ?? "#000000",
      profile_image: profileImage,
      background_image: backgroundImage,
      is_link_background_transparent: isLinkBackgroundTransparent ?? false,
      link_background_color: linkBackgroundColor ?? "#FFFFFF",
      link_background_secondary_color: linkBackgroundSecondaryColor ?? "#FFFFFF",
      link_background_opacity: linkBackgroundOpacity,
      is_link_background_gradient: isLinkBackgroundGradient ?? false,
    };
  
    try {
      const token = localStorage.getItem("jwt_token");
      //LINK - Local
      // const response = await fetch("http://localhost:3522/api/theme-settings", {
      const response = await fetch("https://connectix-server.vercel.app/api/theme-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error("保存に失敗しました");
      }
      setHasUnsavedChanges(false);
      setHasUnsavedChangesLocal(false);
      setShowAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };  

  const hexToRgba = (hex, opacity) => {
    let cleaned = hex.replace("#", "");
    if (cleaned.length === 3) {
      cleaned = cleaned.split("").map(ch => ch + ch).join("");
    }
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // 現在の背景を取得（画像、グラデーション、または単色）
  const getCurrentBackground = () => {
    if (backgroundImage) {
      return `url(${backgroundImage})`
    }
    if (isGradient) {
      return `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`
    }
    return primaryColor
  }

  const getIcon = (type, customIcon) => {
    if (customIcon) {
      return <img src={customIcon} alt="Custom Icon" style={{ width: 24, height: 24, borderRadius: "50%" }} />;
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
  
  const handleImageChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "profile") {
          setProfileImage(reader.result)
        } else {
          setBackgroundImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
      handleChange()
    }
  }

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.error("プロフィールURLのコピーに失敗しました:", error);
    }
  };

  // よく使用される色のプリセット
  const presetColors = ["#9C27B0", "#2196F3", "#4CAF50", "#FF9800", "#F44336", "#E91E63", "#009688", "#673AB7"]

  // グラデーションのプリセット
  const gradientPresets = [
    { start: "#FF512F", end: "#DD2476" },
    { start: "#4158D0", end: "#C850C0" },
    { start: "#0093E9", end: "#80D0C7" },
    { start: "#8EC5FC", end: "#E0C3FC" },
    { start: "#D4FC79", end: "#96E6A1" },
    { start: "#FA8BFF", end: "#2BD2FF" },
    { start: "#FFB347", end: "#FFCC33" },
    { start: "#FF6B6B", end: "#556270" },
  ]

  // リンク背景用のグラデーションプリセットを追加
  const linkGradientPresets = [
    { start: "#FF512F", end: "#DD2476" },
    { start: "#4158D0", end: "#C850C0" },
    { start: "#0093E9", end: "#80D0C7" },
    { start: "#8EC5FC", end: "#E0C3FC" },
    { start: "#D4FC79", end: "#96E6A1" },
    { start: "#FA8BFF", end: "#2BD2FF" },
    { start: "#FFB347", end: "#FFCC33" },
    { start: "#FF6B6B", end: "#556270" },
  ]

  const handleIsGradientChange = (color) => {
    setIsGradient(color)
    handleChange()
  }

  const handlePrimaryColorChange = (color) => {
    setPrimaryColor(color)
    handleChange()
  }

  const handleSecondaryColorChange = (color) => {
    setSecondaryColor(color)
    handleChange()
  }

  const handleUsernameFontColorChange = (color) => {
    setUsernameFontColor(color)
    handleChange()
  }

  const handleUrlFontColorChange = (color) => {
    setUrlFontColor(color)
    handleChange()
  }

  const handleIsLinkBackgroundTransparentChange = (color) => {
    setIsLinkBackgroundTransparent(color)
    handleChange()
  }

  const handleLinkBackgroundColorChange = (color) => {
    setLinkBackgroundColor(color)
    handleChange()
  }

  const handleLinkBackgroundSecondaryColorChange = (color) => {
    setLinkBackgroundSecondaryColor(color)
    handleChange()
  }

  const handleIsLinkBackgroundGradientChange = (color) => {
    setIsLinkBackgroundGradient(color)
    handleChange()
  }

  const handleUsernameChange = (color) => {
    setUsername(color)
    handleChange()
  }

  return (
    <Grid container spacing={2} sx={{ minHeight: "100vh" }}>
      <AnimatedAlert
        show={showAlert}
        severity="success"
        title="Success!"
        message="設定を保存しました！"
      />
      <AnimatedAlert
        show={showErrorAlert}
        severity="error"
        title="Error!"
        message={"保存に失敗しました。"  + errorMessage}
      />
      <Grid item xs={12} md={4} sx={{ maxHeight: "100vh", overflowY: "auto" }}>
        <Stack spacing={4}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              プロフィール画像
            </Typography>
            <input
              type="file"
              accept="image/*"
              id="profile-image-input"
              hidden
              onChange={(e) => {
                handleImageChange(e, "profile")
                handleChange()
              }}
            />
            <label htmlFor="profile-image-input">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundImage: profileImage ? `url(${profileImage})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                  },
                }}
              >
                {!profileImage && <Typography color="text.secondary">画像を選択</Typography>}
              </Box>
            </label>
          </Paper>

          {/* ユーザー名入力 */}
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ユーザー名設定
            </Typography>
            <Stack spacing={2}>
              <Typography variant="subtitle2">ユーザー名</Typography>
              <input
                type="text"
                value={username || ""} // ✅ undefined の場合は空文字をセット
                onChange={(e) => {
                  handleUsernameChange(e.target.value); // ✅ event ではなく e.target.value を渡す
                  handleChange();
                }}
                placeholder="@username"
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </Stack>
          </Paper>
          
          {/* 背景設定 */}
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              背景設定
            </Typography>
            <Stack spacing={2}>
              <input
                type="file"
                accept="image/*"
                id="background-image-input"
                hidden
                onChange={(e) => {
                  handleImageChange(e, "background")
                  handleChange()
                }}
              />
              <label htmlFor="background-image-input">
                <Button variant="outlined" component="span" startIcon={<ImageIcon />} fullWidth>
                  背景画像をアップロード
                </Button>
              </label>
              {backgroundImage && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setBackgroundImage(null)
                      handleChange()
                    }}
                  >
                    背景画像を削除
                  </Button>
                  {/* <FormControlLabel
                    control={
                      <Switch
                        checked={!!isLinkBackgroundTransparent}
                        onChange={(e) => {
                          handleIsLinkBackgroundTransparentChange(e.target.checked)
                          handleChange()
                        }}
                      />
                    }
                    label="リンクの背景を透過する"
                  /> */}
                </>
              )}
              {!backgroundImage && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!isGradient}
                        onChange={(e) => {
                          handleIsGradientChange(e.target.checked)
                          handleChange()
                        }}
                      />
                    }
                    label="グラデーション"
                  />
                  {isGradient ? (
                    <>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2">開始色</Typography>
                        <MuiColorInput
                          value={primaryColor}
                          onChange={handlePrimaryColorChange}
                          format="hex"
                          isAlphaHidden
                          sx={{ width: "100%" }}
                        />
                        <Typography variant="subtitle2">終了色</Typography>
                        <MuiColorInput
                          value={secondaryColor}
                          onChange={handleSecondaryColorChange}
                          format="hex"
                          isAlphaHidden
                          sx={{ width: "100%" }}
                        />
                      </Stack>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        グラデーションプリセット
                      </Typography>
                      <Grid container spacing={1}>
                        {gradientPresets.map((preset, index) => (
                          <Grid item key={index}>
                            <Box
                              onClick={() => {
                                setPrimaryColor(preset.start)
                                setSecondaryColor(preset.end)
                                handleChange()
                              }}
                              sx={{
                                width: 40,
                                height: 40,
                                background: `linear-gradient(45deg, ${preset.start}, ${preset.end})`,
                                borderRadius: 1,
                                cursor: "pointer",
                                border:
                                  primaryColor === preset.start && secondaryColor === preset.end
                                    ? "2px solid black"
                                    : "2px solid transparent",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <MuiColorInput
                        value={primaryColor}
                        onChange={handlePrimaryColorChange}
                        format="hex"
                        isAlphaHidden
                        sx={{ width: "100%" }}
                      />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        プリセットカラー
                      </Typography>
                      <Grid container spacing={1}>
                        {presetColors.map((color) => (
                          <Grid item key={color}>
                            <Box
                              onClick={() => {
                                setPrimaryColor(color)
                                handleChange()
                              }}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: color,
                                borderRadius: 1,
                                cursor: "pointer",
                                border: primaryColor === color ? "2px solid black" : "2px solid transparent",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Paper>

          {/* フォントカラー設定 */}
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              フォントカラー設定
            </Typography>
            <Stack spacing={2}>
              <Typography variant="subtitle2">ユーザー名のフォントカラー</Typography>
              <MuiColorInput
                value={usernameFontColor}
                onChange={handleUsernameFontColorChange}
                format="hex"
                isAlphaHidden
                sx={{ width: "100%" }}
              />

              <Typography variant="subtitle2">URLのフォントカラー</Typography>
              <MuiColorInput
                value={urlFontColor}
                onChange={handleUrlFontColorChange}
                format="hex"
                isAlphaHidden
                sx={{ width: "100%" }}
              />
            </Stack>
          </Paper>

          {/* リンク背景設定 */}
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              リンク背景設定
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!isLinkBackgroundTransparent}
                    onChange={(e) => {
                      handleIsLinkBackgroundTransparentChange(e.target.checked)
                      handleChange()
                    }}
                  />
                }
                label="背景を透過する"
              />
              <Typography variant="subtitle2">背景色</Typography>
              <MuiColorInput
                value={linkBackgroundColor}
                onChange={handleLinkBackgroundColorChange}
                format="hex"
                isAlphaHidden
                sx={{ width: "100%" }}
              />
              {isLinkBackgroundTransparent && (
                <>
                  <Typography variant="subtitle2">透過度</Typography>
                  <Slider
                    value={linkBackgroundOpacity * 100}
                    onChange={(e, newValue) => {
                      const opacity = newValue / 100;
                      setLinkBackgroundOpacity(opacity);
                      handleChange();
                    }}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </>
              )}
              {!isLinkBackgroundTransparent && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!isLinkBackgroundGradient}
                        onChange={(e) => {
                          handleIsLinkBackgroundGradientChange(e.target.checked)
                          handleChange()
                        }}
                      />
                    }
                    label="グラデーション"
                  />
                  {isLinkBackgroundGradient && (
                    <>
                      <Typography variant="subtitle2">グラデーション終了色</Typography>
                      <MuiColorInput
                        value={linkBackgroundSecondaryColor}
                        onChange={handleLinkBackgroundSecondaryColorChange}
                        format="hex"
                        isAlphaHidden
                        sx={{ width: "100%" }}
                      />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        グラデーションプリセット
                      </Typography>
                      <Grid container spacing={1}>
                        {linkGradientPresets.map((preset, index) => (
                          <Grid item key={index}>
                            <Box
                              onClick={() => {
                                setLinkBackgroundColor(preset.start)
                                setLinkBackgroundSecondaryColor(preset.end)
                                handleChange()
                              }}
                              sx={{
                                width: 40,
                                height: 40,
                                background: `linear-gradient(45deg, ${preset.start}, ${preset.end})`,
                                borderRadius: 1,
                                cursor: "pointer",
                                border:
                                  linkBackgroundColor === preset.start && linkBackgroundSecondaryColor === preset.end
                                    ? "2px solid black"
                                    : "2px solid transparent",
                                "&:hover": {
                                  opacity: 0.8,
                                },
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Paper>

          {/* 保存ボタン */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={saveSettings}
            fullWidth
            sx={{ mt: 2 }}
          >
            設定を保存
          </Button>
        </Stack>
      </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            background: getCurrentBackground(),
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 380,
              p: 3,
              textAlign: "center",
              bgcolor: "transparent",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: "#eee",
                backgroundImage: profileImage ? `url(${profileImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                mx: "auto",
                border: `3px solid ${usernameFontColor}`,
              }}
            />
            {/* ユーザー名 */}
            <Typography variant="h5" fontWeight="bold" sx={{ color: usernameFontColor, mt: 2 }}>
              {username}
            </Typography>
            {/* リンク一覧 */}
            <Stack spacing={2} sx={{ width: "100%", mt: 3 }}>
              {links.map((link) => (
                <Button
                  key={link.id}
                  variant="contained"
                  startIcon={getIcon(link.type, link.customIcon)}
                  fullWidth
                  onClick={() => (window.location.href = link.url)}
                  sx={{
                    background: isLinkBackgroundTransparent
                      ? hexToRgba(linkBackgroundColor, linkBackgroundOpacity)
                      : isLinkBackgroundGradient
                      ? `linear-gradient(45deg, ${linkBackgroundColor}, ${linkBackgroundSecondaryColor})`
                      : linkBackgroundColor,
                    color: urlFontColor,
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
            <Button variant="outlined" sx={{ mt: 3 }} onClick={handleShareProfile}>
              プロフィールをシェアする
            </Button>
          </Box>
        </Grid>
      </Grid>
  )
}

ThemeCustomizer.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
}