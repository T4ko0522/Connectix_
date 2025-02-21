import React, { useState, useEffect, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Box, Paper, IconButton, Typography, Button, Stack, TextField, MenuItem } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import InstagramIcon from "@mui/icons-material/Instagram"
import TwitterIcon from "@mui/icons-material/Twitter"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LinkIcon from "@mui/icons-material/Link"
import SaveIcon from "@mui/icons-material/Save"

const VRChatIcon = () => <img src="assets/image/VRChat.png" alt="VRChat Icon" style={{ width: 24, height: 24 }} />;

export default function LinkList() {
  const [links, setLinks] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("認証トークンが存在しません。ログインしてください。");
        }
        const response = await fetch("http://localhost:3522/api/links", {
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
  

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return

    setLinks((prevLinks) => {
      const items = Array.from(prevLinks)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      return items
    })
    setHasUnsavedChanges(true)
  }, [])

  const getIcon = (type, customIcon) => {
    if (customIcon) {
      return <img src={customIcon || "/placeholder.svg"} alt="Custom Icon" style={{ width: 24, height: 24 }} />
    }
    switch (type) {
      case "instagram":
        return <InstagramIcon />
      case "twitter":
        return <TwitterIcon />
      case "youtube":
        return <YouTubeIcon />
      case "vrchat":
        return <VRChatIcon />
      default:
        return <LinkIcon />
    }
  }

  // 新規リンクを追加する関数
  const addNewLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "新しいリンク",
      url: "",
      type: "link",
      customIcon: null,
    }
    setLinks([...links, newLink])
    setHasUnsavedChanges(true)
  }

  // リンクを更新する関数
  const updateLink = (id, field, value) => {
    const updates = { [field]: value }

    // タイプが変更された場合、URLを自動設定
    if (field === "type") {
      switch (value) {
        case "instagram":
          updates.url = "https://www.instagram.com/sampleuser/"
          break
        case "twitter":
          updates.url = "https://twitter.com/sampleuser"
          break
        case "youtube":
          updates.url = "https://www.youtube.com/@sampleuser"
          break
        default:
          break
      }
    }

    const updatedLinks = links.map((link) => (link.id === id ? { ...link, ...updates } : link))
    setLinks(updatedLinks)
    setHasUnsavedChanges(true)
  }

  // リンクを削除する関数
  const deleteLink = (id) => {
    const updatedLinks = links.filter((link) => link.id !== id)
    setLinks(updatedLinks)
    setHasUnsavedChanges(true)
  }

  // カスタムアイコンをアップロードする関数
  const handleIconUpload = (id, event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateLink(id, "customIcon", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  //ANCHOR - リンクを保存する関数
  const saveLinks = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      // ここで、リンクオブジェクト内の "customIcon" を "custom_icon" に変換
      const transformedLinks = links.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        type: link.type,
        custom_icon: link.customIcon, // ここで変換
      }));
  
      const response = await fetch("http://localhost:3522/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // username は不要なので、送信するのは links のみ
        body: JSON.stringify({ links: transformedLinks }),
      });
      if (!response.ok) {
        throw new Error("リンクの保存に失敗しました");
      }
      setHasUnsavedChanges(false);
      alert("リンクが正常に保存されました！");
    } catch (error) {
      alert("エラーが発生しました: " + error.message);
    }
  };  
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={addNewLink}>
            新規リンクを追加
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={saveLinks} disabled={!hasUnsavedChanges}>
            変更を保存
          </Button>
        </Stack>

        {/* links.length > 0 のときだけ Droppable をレンダリング */}
        {links.length > 0 && (
          <Droppable droppableId="links">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Stack spacing={2}>
                  {links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Paper elevation={0} sx={{ p: 2 }}>
                            <Stack spacing={2}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Box>
                                  <DragIndicatorIcon />
                                </Box>
                                {getIcon(link.type, link.customIcon)}
                                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                  {link.title}
                                </Typography>
                                <IconButton color="error" onClick={() => deleteLink(link.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                              <Stack spacing={2}>
                                <TextField
                                  label="タイトル"
                                  value={link.title}
                                  onChange={(e) => updateLink(link.id, "title", e.target.value)}
                                  fullWidth
                                  size="small"
                                />
                                <TextField
                                  label="URL"
                                  value={link.url}
                                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                                  fullWidth
                                  size="small"
                                />
                                <TextField
                                  select
                                  label="タイプ"
                                  value={link.type}
                                  onChange={(e) => updateLink(link.id, "type", e.target.value)}
                                  fullWidth
                                  size="small"
                                >
                                  <MenuItem value="instagram">Instagram</MenuItem>
                                  <MenuItem value="twitter">Twitter</MenuItem>
                                  <MenuItem value="youtube">YouTube</MenuItem>
                                  <MenuItem value="vrchat">VRChat</MenuItem>
                                  <MenuItem value="link">カスタムリンク</MenuItem>
                                </TextField>
                                <input
                                  accept="image/*"
                                  id={`icon-upload-${link.id}`}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleIconUpload(link.id, e)}
                                />
                                <label htmlFor={`icon-upload-${link.id}`}>
                                  <Button variant="outlined" component="span">
                                    カスタムアイコンをアップロード
                                  </Button>
                                </label>
                              </Stack>
                            </Stack>
                          </Paper>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              </div>
            )}
          </Droppable>
        )}
      </Stack>
    </DragDropContext>
  )
}