import log from './log'
import { initialize } from './initialize';
import { completion, CompletionParams } from './methods/textDocument/completion';
import { didChange } from './methods/textDocument/didChange';

type RequestMethod = (message: RequestMessage) => ReturnType<typeof initialize> | ReturnType<typeof completion>
type NotificationMethod = (message: NotificationMessage) => void
const methodLookup: Record<string, RequestMethod | NotificationMethod> = {
  "initialize": initialize,
  "textDocument/completion": completion,
  "textDocument/didChange": didChange
}

function respond(id: RequestMessage["id"], result: object | null) {
  const message = JSON.stringify({ id, result })
  const messageLength = Buffer.byteLength(message, "utf-8")
  const header = `Content-Length: ${messageLength}\r\n\r\n`
  log.write("Server is up")
  const response = header + message
  //log.write(response)
  process.stdout.write(response)
}
interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: CompletionParams[] | object;
}
export interface RequestMessage extends Message {
  id: number | string;
  method: string;
  params?: CompletionParams[] | object;
}

let buffer = ""
process.stdin.on("data", (chunk) => {
  buffer += chunk

  while (true) {
    const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/)
    if (!lengthMatch) break
    const contentLength = parseInt(lengthMatch[1], 10)
    const messageStart = buffer.indexOf("\r\n\r\n") + 4;

    if (buffer.length < messageStart + contentLength) break

    const rawMessage = buffer.slice(messageStart, messageStart + contentLength)
    const message = JSON.parse(rawMessage)

    log.write({ id: message.id, method: message.method, params: message.params })

    const method = methodLookup[message.method]
    if (method) {
      const result = method(message)
      if (result !== undefined) {
        respond(message.id, result)
      }
    }

    buffer = buffer.slice(messageStart + contentLength)
  }
})