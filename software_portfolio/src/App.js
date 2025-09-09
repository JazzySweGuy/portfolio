import React, { useRef, useEffect } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = 40;        // space between dots
    const baseRadius = 1;      // default dot size
    const maxRadius = 4;       // max size when hovered
    const hoverDistance = 120; // cursor effect distance

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
      // clear + paint background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = cursor.x - x;
          const dy = cursor.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // size scaling
          let radius = baseRadius;
          if (dist < hoverDistance) {
            let scale = Math.max(0, Math.min(1, 1 - dist / hoverDistance));
            radius = baseRadius + scale * (maxRadius - baseRadius);
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          // inactive = white, active = cyan
          ctx.fillStyle = dist < hoverDistance ? "red" : "black";
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        cursor: "none",
      }}
    />
  );
}

export default App;
