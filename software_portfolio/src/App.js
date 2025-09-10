import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const canvasRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ✅ Detect small screens (breakpoint: 600px)
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = 40;
    const baseRadius = 1;
    const maxRadius = 4;
    const hoverDistance = 120;

    let cursor = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = cursor.x - x;
          const dy = cursor.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = baseRadius;
          if (dist < hoverDistance) {
            let scale = Math.max(0, Math.min(1, 1 - dist / hoverDistance));
            radius = baseRadius + scale * (maxRadius - baseRadius);
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = dist < hoverDistance ? "rgba(110,171,231,1)" : "black";
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = ["Home", "About", "Projects", "Learning"];

  return (
    <div>
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />

      {/* Navbar */}
      <Box
        sx={{
          border: 1,
          marginTop: 3,
          marginLeft: 5,
          marginRight: 5,
          padding: 1.5,
          backgroundColor: "rgba(196, 189, 189, 0.27)",
          borderRadius: 2,
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Portfolio
        </Typography>

        {/* Desktop menu */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 5 }}>
            {menuItems.map((item) => (
              <Typography key={item} variant="h6" sx={{ cursor: "pointer" }}>
                {item}
              </Typography>
            ))}
          </Box>
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ backgroundColor: "red",width: 250, padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default App;
