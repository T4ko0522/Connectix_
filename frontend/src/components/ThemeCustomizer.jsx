import React from "react";
import { Stack, Paper, Typography, Box, Grid } from "@mui/material";

export default function ThemeCustomizer() {
  return (
    <Stack spacing={4}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          カラーテーマ
        </Typography>
        <Grid container spacing={2}>
          {["#9C27B0", "#2196F3", "#4CAF50", "#FF9800", "#F44336"].map((color) => (
            <Grid item key={color}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          プロフィール画像
        </Typography>
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
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
        >
          <Typography color="text.secondary">画像を選択</Typography>
        </Box>
      </Paper>
    </Stack>
  )
}