package main

import (
	"fmt"
	"github.com/khalidoukoujane/textstream/decoder"
)

func main() {
	fmt.Println("Hello")
	ch := make(chan []byte, 10)
	go decoder.StartDecoder("vid", ch)
}