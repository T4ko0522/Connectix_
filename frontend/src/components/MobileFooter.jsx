import react from "react"
import { Box, Typography } from "@mui/material"

const MobileFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(to right, #60519b, #31323e)",
        color: "white",
        padding: "8px",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontFamily: "RobotoCondensed-Italic, RobotoCondensed, NotoSansJP, Arial, sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: ".03rem",
          textAlign: "center",
        }}
      >
        © 2025 Connectix. All Rights Reserved.
      </Typography>
    </Box>
  )
}

export default MobileFooter