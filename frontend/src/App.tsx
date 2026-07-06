import { useEffect, useRef } from "react";
import "./App.css";

const WIDTH = 160;
const HEIGHT = 90;
const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 8;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let latestFrame: Uint8Array | null = null;
    let prevFrame: Uint8Array | null = null;
    let animFrameId: number;
    const colorCache = new Map<number, string>();
    const getColor = (r: number, g: number, b: number): string => {
      const key = (r << 16) | (g << 8) | b;
      if (!colorCache.has(key)) {
        colorCache.set(key, `rgb(${r},${g},${b})`);
      }
      return colorCache.get(key)!;
    };


    const ws = new WebSocket(`ws://localhost:8080/ws`);
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      latestFrame = new Uint8Array(event.data);
    };

    const drawFrame = (view: Uint8Array) => {
      for (let i = 0; i < view.length; i += 4) {
        const r = view[i];
        const g = view[i + 1];
        const b = view[i + 2];
        // const charCode = view[i + 3];
        if (
          prevFrame &&
          prevFrame[i] === r &&
          prevFrame[i + 1] === g &&
          prevFrame[i + 2] === b &&
          prevFrame[i + 3] === view[i + 3]
        )
          continue;

        const col = (i / 4) % WIDTH;
        const row = Math.floor(i / 4 / WIDTH);

        const x = col * CHAR_WIDTH;
        const y = row * CHAR_HEIGHT;
        // ctx.fillStyle = "#000000";
        // ctx.fillRect(x, y, CHAR_WIDTH, CHAR_HEIGHT);

        // const char = String.fromCharCode(charCode);
        // if (char === " ") continue;

        // // draw colored char
        // ctx.fillStyle = getColor(r, g, b);
        // ctx.fillText(char, x, y);
        ctx.fillStyle = getColor(r, g, b);
        ctx.fillRect(x, y, CHAR_WIDTH, CHAR_HEIGHT);
      }
      prevFrame = new Uint8Array(view);
    };

    const render = () => {
      if (latestFrame) {
        drawFrame(latestFrame);
        latestFrame = null;
      }
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    ws.onclose = () => cancelAnimationFrame(animFrameId);
    ws.onerror = (err) => console.error("websocket error:", err);

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
