import { RequestMessage } from "./server";


type ServerCapabilities = Record<string, unknown>
interface InitializeResult {
    capabilities: ServerCapabilities;
    serverInfo?: {
        name: string;
        version?: string;
    };
}

export function initialize(message: RequestMessage): InitializeResult {
    return {
        capabilities: {
            completionProvider: {},
            textDocumentSync: 1
        },
        serverInfo: {
            name: "lsp-from-scratch",
            version: "0.0.1"
        }
    }
}