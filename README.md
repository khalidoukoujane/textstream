# textstream

Stream any video file as colored pixels in the browser no video element, no codec, just a canvas drawing colored blocks at 30fps.

---

## how it works

```
video.mp4
    ↓
ffmpeg extracts raw RGB frames
    ↓
Go maps each pixel to a colored block
    ↓
WebSocket streams binary frames to browser
    ↓
Canvas renders 14400 colored blocks at 30fps
```

## run locally

requirements: Go 1.21+, ffmpeg, Node.js 18+

```bash
git clone https://github.com/khalidoukoujane/textstream
cd textstream

# build the frontend
cd frontend
npm install
npm run build
cd ..

# run with a video file
go run backend/main.go video.mp4
```

Then open `http://localhost:8080`.

## run with Docker

requirements: Docker

```bash
git clone https://github.com/khalidoukoujane/textstream
cd textstream

# place your video at the project root
cp /path/to/video.mp4 ./video.mp4

docker compose up --build
```

Then open `http://localhost:8080`.

## stack

- [Go](https://go.dev) — video decoding pipeline + WebSocket server
- [gorilla/websocket](https://github.com/gorilla/websocket) — WebSocket transport
- [ffmpeg](https://ffmpeg.org) — raw frame extraction
- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) — frontend
- HTML5 Canvas — pixel rendering
