package main

import (
	"bufio"
	"log"
	"os"

	rpc "github.com/harish876/lsp-from-scratch/pkg"
)

func main() {
	logger := getLogger("/Users/harishgokul/lsp-from-scratch/server-go/log.txt")
	logger.Println("Hey I started")
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(rpc.Split)

	for scanner.Scan() {
		msg := scanner.Text()
		handlerMessage(logger, msg)
	}
}

func handlerMessage(logger *log.Logger, msg any) {
	logger.Println(msg)
}

func getLogger(filename string) *log.Logger {
	logfile, err := os.OpenFile(filename, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0666)
	if err != nil {
		panic("Couldn't open file: %s" + filename)
	}

	return log.New(logfile, "[lsp-from-scratch] ", log.Ldate|log.Ltime|log.Lshortfile)
}
