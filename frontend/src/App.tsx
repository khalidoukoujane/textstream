import { useEffect, useRef } from "react";
import "./App.css";

const WIDTH = 160;
const HEIGHT = 90;
const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 14;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${CHAR_HEIGHT}px monospace`;
    ctx.textBaseline = "top";

    let latestFrame: Uint8Array | null = null;
    let animFrameId: number;

    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      latestFrame = new Uint8Array(event.data);
    };
    const drawFrame = (view: Uint8Array) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colorMap = new Map<
        string,
        { chars: string[]; xs: number[]; ys: number[] }
      >();

      for (let i = 0; i < view.length; i += 4) {
        const r = view[i];
        const g = view[i + 1];
        const b = view[i + 2];
        const char = String.fromCharCode(view[i + 3]);
        if (char === " ") continue;

        const pixelIndex = i / 4;
        const col = pixelIndex % WIDTH;
        const row = Math.floor(pixelIndex / WIDTH);

        const x = col * CHAR_WIDTH;
        const y = row * CHAR_HEIGHT;

        const colorKey = `${r},${g},${b}`;

        if (!colorMap.has(colorKey)) {
          colorMap.set(colorKey, { chars: [], xs: [], ys: [] });
        }
        const group = colorMap.get(colorKey)!;
        group.chars.push(char);
        group.xs.push(x);
        group.ys.push(y);
      }
      for (const [colorKey, group] of colorMap) {
        ctx.fillStyle = `rgb(${colorKey})`;
        for (let j = 0; j < group.chars.length; j++) {
          ctx.fillText(group.chars[j], group.xs[j], group.ys[j]);
        }
      }
    };

    const render = () => {
      if (latestFrame) {
        drawFrame(latestFrame);
        latestFrame = null;
      }
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    ws.onclose = () => {
      cancelAnimationFrame(animFrameId);
    };

    ws.onerror = (err) => {
      console.error("websocket error:", err);
    };

    return () => {
      ws.close();
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
    <h1 className="header">This is not a video its just Text</h1>
      <canvas
        ref={canvasRef}
        width={WIDTH * CHAR_WIDTH}
        height={HEIGHT * CHAR_HEIGHT}
      />
    </>
  );
}

export default App;
