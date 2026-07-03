package server

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/khalidoukoujane/textstream/decoder"
	"github.com/khalidoukoujane/textstream/encoder"
)

var vidPath string

var upgrader = websocket.Upgrader {
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHandler (w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()
	frames := make(chan []byte, 10)
	ticker := time.NewTicker(time.Second / 30)
	go decoder.StartDecoder(vidPath, frames)
	for frame := range(frames) {
		data := encoder.EncodeFrame(frame, 160, 90)
		if data == nil {
    	    continue
		}
		<-ticker.C
		err := conn.WriteMessage(websocket.BinaryMessage, data)
		if err != nil {
			log.Println("client disconnected")
			break
		}
	}
}

func StartServer(videoPath string) {
	vidPath = videoPath
	http.HandleFunc("/ws", wsHandler)
	frontendPath := "../frontend/dist"
	http.Handle("/", http.FileServer(http.Dir(frontendPath)))
	fmt.Println("starting server on port: 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error: cannot start the server", err)
	}
}