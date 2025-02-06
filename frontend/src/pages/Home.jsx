import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from "@mui/material/Avatar";
import { YouTube, Twitter } from "@mui/icons-material";
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Home() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #9575cd 0%, #7986cb 100%)",
        pt: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            mb: 8,
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              好きなリンク名、<br/>
              直感的なUI
            </Typography>

            {/* URL Input Section */}
            <Card
              sx={{
                p: 2,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  「connectix-xi.vercel.app/」<br/>
                  Original URL for free
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="connectix-xi.vercel.app/"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate('/sign-up')
                    }
                    sx={{
                      backgroundColor: "#1e202c",
                      "&:hover": {
                        backgroundColor: "#2a2d3d",
                      },
                    }}
                  >
                    今すぐ<br/>
                    始める
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Content */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            {/* Profile Section */}
            <Card
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar src="/placeholder.svg" sx={{ width: 80, height: 80, mr: 2 }} />
                <Typography variant="h6">@UserName</Typography>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<InstagramIcon />}
                  sx={{
                    display: "inline",
                    textTransform: "none",
                    color: "#1e202c",
                    borderColor: "#1e202c",
                    "&:hover": {
                      borderColor: "#1e202c",
                      backgroundColor: "rgba(30, 32, 44, 0.04)",
                    },
                  }}
                >
                  Instagram
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<YouTube />}
                  sx={{
                    display: "inline",
                    textTransform: "none",
                    color: "#1e202c",
                    borderColor: "#1e202c",
                    "&:hover": {
                      borderColor: "#1e202c",
                      backgroundColor: "rgba(30, 32, 44, 0.04)",
                    },
                  }}
                >
                  YouTube
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Twitter />}
                  sx={{
                    display: "inline",
                    textTransform: "none",
                    color: "#1e202c",
                    borderColor: "#1e202c",
                    "&:hover": {
                      borderColor: "#1e202c",
                      backgroundColor: "rgba(30, 32, 44, 0.04)",
                    },
                  }}
                >
                  Twitter
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}