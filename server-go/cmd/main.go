package main

import (
	"bufio"
	"encoding/json"
	"log"
	"os"

	"github.com/harish876/lsp-from-scratch/analysis"
	"github.com/harish876/lsp-from-scratch/pkg/lsp"
	rpc "github.com/harish876/lsp-from-scratch/pkg/rpc"
)

func main() {
	logger := getLogger("/Users/harishgokul/lsp-from-scratch/server-go/log.txt")
	logger.Println("Hey man I started")
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(rpc.Split)
	state := analysis.NewState()

	for {
		for scanner.Scan() {
			msg := scanner.Bytes()
			method, content, err := rpc.DecodeMessage(msg)
			if err != nil {
				logger.Printf("We gots some error: %v", err)
			}
			handlerMessage(logger, method, content, state)
		}
	}

}

func handlerMessage(logger *log.Logger, method string, content []byte, state analysis.State) {
	logger.Printf("Received method: %s Content: %s", method, content)

	switch method {
	case "initialize":
		var request lsp.InitializeRequest
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize request request %v", err)
		}
		logger.Printf("Connected to: %s %s",
			request.Params.ClientInfo.Name,
			request.Params.ClientInfo.Version)

		msg := lsp.NewInitializeResponse(request.ID)
		reply := rpc.EncodeMessage(msg)
		writer := os.Stdout
		writer.Write([]byte(reply))

		logger.Printf("Sent the message %s", reply)
	case "textDocument/didOpen":
		var request lsp.DidOpenTextDocumentNotification
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize request request %v", err)
		}
		logger.Printf("Opened: %s %s",
			request.Params.TextDocument.URI, request.Params.TextDocument.Text)

		state.OpenDocument(request.Params.TextDocument.URI, request.Params.TextDocument.Text)
	}
}

func getLogger(filename string) *log.Logger {
	logfile, err := os.OpenFile(filename, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0666)
	if err != nil {
		panic("Couldn't open file: %s" + filename)
	}

	return log.New(logfile, "[lsp-from-scratch] ", log.Ldate|log.Ltime|log.Lshortfile)
}
