// app/statistics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Log } from "@/app/utils/logger";

type Stat = {
  shortUrl: string;
  createdAt: string;
  expiresAt: string;
  clickCount: number;
  clicks: {
    timestamp: string;
    source: string;
    location: string;
  }[];
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("https://your-backend/statistics");
        const data = await res.json();
        setStats(data);
      } catch (e) {
        await Log("frontend", "error", "network", "Failed to fetch stats");
      }
    }
    loadStats();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>

      {stats.map((s, idx) => (
        <Paper key={idx} sx={{ p: 2, mt: 2 }}>
          <Typography>Short: {s.shortUrl}</Typography>
          <Typography>Created: {s.createdAt}</Typography>
          <Typography>Expires: {s.expiresAt}</Typography>
          <Typography>Clicks: {s.clickCount}</Typography>
          {s.clicks.map((c, i) => (
            <Box key={i} sx={{ ml: 2 }}>
              <Typography>⏱ {c.timestamp}</Typography>
              <Typography>🌐 {c.source}</Typography>
              <Typography>📍 {c.location}</Typography>
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
}
