import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import GitHubIcon from "@mui/icons-material/GitHub";
import { YouTube, Twitter } from "@mui/icons-material";
import Footer from "../components/Footer.jsx";
import ReactButton from "../components/Button.jsx";

export default function MobileHome() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("jwt_token")
  const handleTwitterClick = () => {
    window.location.href = "https://x.com/Tako_0522"
  }
  const handleYouTubeClick = () => {
    window.location.href = "https://www.youtube.com/@%E3%82%BF%E3%82%B3%E3%81%95%E3%82%93%E3%81%A7%E3%81%99"
  }
  const handleGithubClick = () => {
    window.location.href = "https://github.com/T4ko0522"
  }
  const prefix = "connectix-xi.vercel.app/"
  const [customURL, setCustomURL] = useState("")

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(prefix, "");
    setCustomURL(inputValue);
  };  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e202c 0%, #6e729d 100%)",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
            好きなリンク名
            <br />
            直感的なUI
          </Typography>
          <Card
            sx={{
              p: 2,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              width: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
                「connectix-xi.vercel.app/」
                <br />
                Original URL for free
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={customURL}
                onChange={handleChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: "gray", fontWeight: "bold" }}>
                        {prefix}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ReactButton onClick={() => navigate(isLoggedIn ? "/dashboard" : "/sign-up")} />
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              p: 3,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar src="/placeholder.svg" sx={{ width: 50, height: 50, mr: 2 }} />
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                @SampleUser(製作者)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                onClick={handleTwitterClick}
                fullWidth
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "none",
                  color: "#1e202c",
                  borderColor: "#1e202c",
                  "&:hover": {
                    borderColor: "#1e202c",
                    backgroundColor: "rgba(30, 32, 44, 0.04)",
                  },
                }}
              >
                <Twitter sx={{ mr: 1 }} /> Twitter
              </Button>
              <Button
                onClick={handleYouTubeClick}
                fullWidth
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "none",
                  color: "#1e202c",
                  borderColor: "#1e202c",
                  "&:hover": {
                    borderColor: "#1e202c",
                    backgroundColor: "rgba(30, 32, 44, 0.04)",
                  },
                }}
              >
                <YouTube sx={{ mr: 1 }} /> YouTube
              </Button>
              <Button
                onClick={handleGithubClick}
                fullWidth
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "none",
                  color: "#1e202c",
                  borderColor: "#1e202c",
                  "&:hover": {
                    borderColor: "#1e202c",
                    backgroundColor: "rgba(30, 32, 44, 0.04)",
                  },
                }}
              >
                <GitHubIcon sx={{ mr: 1 }} /> GitHub
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}