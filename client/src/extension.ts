import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;


export function activate(context: ExtensionContext) {

  let serverVersion = "go"
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js")
  );
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions

  if (serverVersion === "node") {
    serverOptions = {
      run: { module: serverModule, transport: TransportKind.stdio },
      debug: {
        module: serverModule,
        transport: TransportKind.stdio,
      },
    }
  }
  else {
    serverOptions = {
      run: {
        command: "/Users/harishgokul/lsp-from-scratch/server-go/tmp/main",
        transport: TransportKind.stdio,

      },
      debug: {
        command: "/Users/harishgokul/lsp-from-scratch/server-go/tmp/main",
        transport: TransportKind.stdio,
      }
    };
  }

  console.log(serverOptions)

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [{ scheme: "file", language: "*" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "Harish LSP Client",
    "Harish LSP Server",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
