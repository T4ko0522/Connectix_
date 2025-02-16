import React from "react";
import { Stack, Paper, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "月", value: 400 },
  { name: "火", value: 300 },
  { name: "水", value: 600 },
  { name: "木", value: 800 },
  { name: "金", value: 500 },
  { name: "土", value: 900 },
  { name: "日", value: 700 },
]

export default function Analytics() {
  return (
    <Stack spacing={4}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          訪問者数(この機能は未完成です)
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9C27B0" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          クリック数ランキング
        </Typography>
        <Stack spacing={2}>
          {data.slice(0, 5).map((item, index) => (
            <Box
              key={item.name}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {index + 1}.
              </Typography>
              <Typography sx={{ flexGrow: 1 }}>ExampleService</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.value} クリック
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}