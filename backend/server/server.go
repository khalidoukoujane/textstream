package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHandler (w http.ResponseWriter, r *http.Request) {
	// conn, err:= upgrader.Upgrade(w, r, nil)

}

func StartServer() {
	http.HandleFunc("/ws", wsHandler)
	frontendPath := "../frontend/dist"
	http.Handle("/", http.FileServer(http.Dir(frontendPath)))
	fmt.Println("starting server on port: 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error: cannot start the server", err)
	}
}