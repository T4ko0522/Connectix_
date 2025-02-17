import React, { useState, useEffect } from "react"
import { Stack, Paper, Typography, Box, Grid, Button, Switch, FormControlLabel } from "@mui/material"
import { MuiColorInput } from "mui-color-input"
import InstagramIcon from "@mui/icons-material/Instagram"
import TwitterIcon from "@mui/icons-material/Twitter"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LinkIcon from "@mui/icons-material/Link"
import ImageIcon from "@mui/icons-material/Image"
import SaveIcon from "@mui/icons-material/Save"
import PropTypes from "prop-types"

export default function ThemeCustomizer({ setHasUnsavedChanges }) {
  const [isGradient, setIsGradient] = useState(false)
  const [primaryColor, setPrimaryColor] = useState("#ffffff")
  const [secondaryColor, setSecondaryColor] = useState("#E91E63")
  const [usernameFontColor, setUsernameFontColor] = useState("#000000")
  const [urlFontColor, setUrlFontColor] = useState("#000000")
  const [profileImage, setProfileImage] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [isLinkBackgroundTransparent, setIsLinkBackgroundTransparent] = useState(false)
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("#FFFFFF")
  const [linkBackgroundSecondaryColor, setLinkBackgroundSecondaryColor] = useState("#FFFFFF")
  const [isLinkBackgroundGradient, setIsLinkBackgroundGradient] = useState(false)
  const [username, setUsername] = useState("@username")
  const [hasUnsavedChangesLocal, setHasUnsavedChangesLocal] = useState(false)
  const [links, setLinks] = useState([]);
  const VRChatIcon = () => <img src="assets/image/VRChat.png" alt="VRChat Icon" style={{ width: 24, height: 24 }} />;
  
  useEffect(() => {
    const savedLinks = localStorage.getItem("savedLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }

    // ストレージの変更を監視
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
    const savedSettings = localStorage.getItem("themeCustomizerSettings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setIsGradient(parsedSettings.isGradient)
      setPrimaryColor(parsedSettings.primaryColor)
      setSecondaryColor(parsedSettings.secondaryColor)
      setUsernameFontColor(parsedSettings.usernameFontColor)
      setUrlFontColor(parsedSettings.urlFontColor)
      setProfileImage(parsedSettings.profileImage)
      setBackgroundImage(parsedSettings.backgroundImage)
      setIsLinkBackgroundTransparent(parsedSettings.isLinkBackgroundTransparent)
      setLinkBackgroundColor(parsedSettings.linkBackgroundColor)
      setLinkBackgroundSecondaryColor(parsedSettings.linkBackgroundSecondaryColor)
      setIsLinkBackgroundGradient(parsedSettings.isLinkBackgroundGradient)
      setUsername(parsedSettings.username)
    }
  }, [])

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

  const saveSettings = () => {
    const settings = {
      isGradient,
      primaryColor,
      secondaryColor,
      usernameFontColor,
      urlFontColor,
      profileImage,
      backgroundImage,
      isLinkBackgroundTransparent,
      linkBackgroundColor,
      linkBackgroundSecondaryColor,
      isLinkBackgroundGradient,
      username,
    }
    localStorage.setItem("themeCustomizerSettings", JSON.stringify(settings))
    setHasUnsavedChanges(false)
    setHasUnsavedChangesLocal(false)
    alert("設定が保存されました")
  }

  // 変更を検知して hasUnsavedChanges を true に設定する関数
  const handleChange = () => {
    setHasUnsavedChangesLocal(true)
    setHasUnsavedChanges(true)
  }

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

  // プレビュー用のダミーリンク
  // const previewLinks = [
  //   { id: "1", title: "Instagram", url: "https://instagram.com/username", type: "instagram" },
  //   { id: "2", title: "Twitter", url: "https://twitter.com/username", type: "twitter" },
  //   { id: "3", title: "YouTube", url: "https://youtube.com/@username", type: "youtube" },
  // ]

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
    <Grid container spacing={0}>
      <Grid item xs={12} md={7} sx={{ height: "100vh", overflowY: "auto", pr: 2 }}>
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
                    label="リンクの背景を透過する"
                  />
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
                  <Typography variant="subtitle2">背景色</Typography>
                  <MuiColorInput
                    value={linkBackgroundColor}
                    onChange={handleLinkBackgroundColorChange}
                    format="hex"
                    isAlphaHidden
                    sx={{ width: "100%" }}
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

      {/* プレビュー部分 */}
      <Grid item xs={12} md={5} sx={{ position: "relative" }}>
        <Box sx={{ position: "fixed", width: "calc(41.67% - 32px)", maxWidth: "600px" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "calc(100vh - 32px)",
              bgcolor: "grey.100",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ alignSelf: "flex-start" }}>
              プレビュー
            </Typography>

            <Box
              sx={{
                width: "100%",
                maxWidth: 380,
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                p: 3,
                borderRadius: 2,
                background: getCurrentBackground(),
                backgroundSize: "cover",
                backgroundPosition: "center",
                overflow: "auto",
                maxHeight: "calc(100% - 60px)",
              }}
            >
              {/* プロフィール画像 */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "#eee",
                  backgroundImage: profileImage ? `url(${profileImage})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: `3px solid ${usernameFontColor}`,
                }}
              />

              {/* ユーザー名 */}
              <Typography variant="h5" fontWeight="bold" sx={{ color: usernameFontColor }}>
                {username}
              </Typography>

              {/* リンクボタン */}
              <Stack spacing={2} sx={{ width: "100%" }}>
                {links.map((link) => (
                  <Button
                    key={link.id}
                    variant="contained"
                    startIcon={getIcon(link.type, link.customIcon)}
                    fullWidth
                    sx={{
                      background: isLinkBackgroundTransparent
                        ? "transparent"
                        : isLinkBackgroundGradient
                        ? `linear-gradient(45deg, ${linkBackgroundColor}, ${linkBackgroundSecondaryColor})`
                        : linkBackgroundColor,
                      color: urlFontColor,
                      "&:hover": {
                        background: isLinkBackgroundTransparent
                          ? "rgba(255, 255, 255, 0.1)"
                          : isLinkBackgroundGradient
                          ? `linear-gradient(45deg, ${linkBackgroundColor}, ${linkBackgroundSecondaryColor})`
                          : linkBackgroundColor,
                        opacity: 0.8,
                      },
                      textTransform: "none",
                      py: 1.5,
                      border: isLinkBackgroundTransparent ? `1px solid ${urlFontColor}` : "none",
                    }}
                  >
                    {link.title}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  )
}

ThemeCustomizer.propTypes = {
  setHasUnsavedChanges: PropTypes.func.isRequired,
}