import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Box, Paper, IconButton, Typography, Button, Stack, TextField, MenuItem } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import InstagramIcon from "@mui/icons-material/Instagram"
import TwitterIcon from "@mui/icons-material/Twitter"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LinkIcon from "@mui/icons-material/Link"

export default function LinkList() {
  const [links, setLinks] = useState([
    { id: "1", title: "Instagram", url: "https://instagram.com/username", type: "instagram" },
    { id: "2", title: "Twitter", url: "https://twitter.com/username", type: "twitter" },
    { id: "3", title: "YouTube", url: "https://youtube.com/@username", type: "youtube" },
  ])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setLinks(items)
  }

  const getIcon = (type) => {
    switch (type) {
      case "instagram":
        return <InstagramIcon />
      case "twitter":
        return <TwitterIcon />
      case "youtube":
        return <YouTubeIcon />
      default:
        return <LinkIcon />
    }
  }

  return (
    <Stack spacing={3}>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: "flex-start" }}>
        新規リンクを追加
      </Button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <Stack spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <Paper ref={provided.innerRef} {...provided.draggableProps} elevation={0} sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                          </Box>
                          {getIcon(link.type)}
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            {link.title}
                          </Typography>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                        <Stack spacing={2}>
                          <TextField label="タイトル" value={link.title} fullWidth size="small" />
                          <TextField label="URL" value={link.url} fullWidth size="small" />
                          <TextField select label="タイプ" value={link.type} fullWidth size="small">
                            <MenuItem value="instagram">Instagram</MenuItem>
                            <MenuItem value="twitter">Twitter</MenuItem>
                            <MenuItem value="youtube">YouTube</MenuItem>
                            <MenuItem value="link">カスタムリンク</MenuItem>
                          </TextField>
                        </Stack>
                      </Stack>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  )
}