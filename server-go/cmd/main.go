package main

import (
	"bufio"
	"encoding/json"
	"io"
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
	writer := os.Stdout

	for {
		for scanner.Scan() {
			msg := scanner.Bytes()
			method, content, err := rpc.DecodeMessage(msg)
			if err != nil {
				logger.Printf("We gots some error: %v", err)
			}
			handlerMessage(logger, method, content, state, writer)
		}
	}

}

func handlerMessage(logger *log.Logger, method string, content []byte, state analysis.State, writer io.Writer) {
	logger.Printf("Received method: %s", method)

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
		reply := writeResponse(writer, msg)

		logger.Printf("Sent the message %s", reply)

	case "textDocument/didOpen":
		var request lsp.DidOpenTextDocumentNotification
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize textDocument/didOpen request %v", err)
		}
		logger.Printf("textDocument/didOpen -  URI: %s",
			request.Params.TextDocument.URI)

		state.OpenDocument(request.Params.TextDocument.URI, request.Params.TextDocument.Text)

	case "textDocument/didChange":
		var request lsp.DidChangeTextDocumentNotification
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize textDocument/didChange request %v", err)
		}
		logger.Printf("textDocument/didChange-  URI: %s",
			request.Params.TextDocument.URI)

		for _, contentChange := range request.Params.ContentChanges {
			state.UpdateDocument(request.Params.TextDocument.URI, contentChange.Text)
		}

	case "textDocument/hover":
		var request lsp.HoverRequest
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize textDocument/hover request %v", err)
		}
		logger.Printf("textDocument/hover -  URI: %s ,  Line: %d , Character %d",
			request.Params.TextDocument.URI,
			request.Params.Position.Character,
			request.Params.Position.Line,
		)

		msg := state.Hover(request.ID, request.Params.TextDocument.URI, request.Params.Position.Line)
		reply := writeResponse(writer, msg)
		logger.Printf("Sent the reply for textDocumen/hover %s", reply)

	case "textDocument/completion":
		var request lsp.TextDocumentCompletionRequest
		if err := json.Unmarshal(content, &request); err != nil {
			logger.Printf("Could Not Unmarshal initialize textDocument/completion request %v", err)
		}
		logger.Printf("textDocument/completion -  TriggerCharacter: %s",
			request.Params.Context.TriggerCharacter,
		)

		msg := lsp.NewTextDocumentCompletionResponse(request.ID)
		reply := writeResponse(writer, msg)
		logger.Printf("Sent the reply for textDocumen/completion %s", reply)
	}
}

func writeResponse(writer io.Writer, msg any) string {
	reply := rpc.EncodeMessage(msg)
	writer.Write([]byte(reply))
	return reply
}

func getLogger(filename string) *log.Logger {
	logfile, err := os.OpenFile(filename, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0666)
	if err != nil {
		panic("Couldn't open file: %s" + filename)
	}

	return log.New(logfile, "[lsp-from-scratch] ", log.Ldate|log.Ltime|log.Lshortfile)
}
