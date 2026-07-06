FROM node:25-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM golang:1.25-alpine AS backend-builder

RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY backend/ .
RUN go mod download
RUN go build -o textstream .

FROM alpine:latest

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY --from=backend-builder /app/textstream .
COPY --from=frontend-builder /frontend/dist ./frontend/dist

EXPOSE 8080

ENTRYPOINT ["./textstream"]