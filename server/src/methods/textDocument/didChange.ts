import { document, TextDocumentContentChangeEvent, VersionedTextDocumentIdentifier } from "../../documents";
import log from "../../log";
import { NotificationMessage } from "../../server";

interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier;
    contentChanges: TextDocumentContentChangeEvent[];
}

export function didChange(message: NotificationMessage): void {

    const params = message.params as DidChangeTextDocumentParams;
    document.set(params.textDocument.uri,params.contentChanges[0].text)
    log.write(message)
}