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
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "server.js")
  );

  const goServerModule = context.asAbsolutePath(
    path.join("server-go", "cmd", "main.go")
  )

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: {
      command: "/Users/harishgokul/lsp-from-scratch/server-go/main",
      transport: TransportKind.stdio,
      options: {
        cwd: "server-go"
      }

    },
    debug: {
      command: "/Users/harishgokul/lsp-from-scratch/server-go/main",
      transport: TransportKind.stdio,
    }
    // run: { module: goServerModule, transport: TransportKind.stdio },
    // debug: {
    //   module: goServerModule,
    //   transport: TransportKind.stdio,
    // },
  };

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
