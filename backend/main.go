package main

import (
	"fmt"
	"os"

	"github.com/khalidoukoujane/textstream/server"
)

func main() {
	args := os.Args[1:]
	fmt.Println("Hello")
	server.StartServer(args[0])
}