import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e202c 0%, #6e729d 100%)",
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography variant="h1" component="h1" gutterBottom sx={{ color: "#fff" }}>
            404 NotFound
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#fff" }}>
            ページが見つかりません
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#fff" }}>
            お探しのページは存在しないか、移動または削除された可能性があります。
          </Typography>
          <Button
            variant="contained"
            sx={{
                backgroundColor: "#7E57C2",
                color: "#fff",
                "&:hover": {
                backgroundColor: "#673AB7",
                },
                mt: 4,
            }}
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            >
            ホームに戻る
          </Button>
        </Box>
      </Container>
    </Box>
  )
}