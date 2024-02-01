export type DocumentUri = string;
type DocumentBody = string;

interface TextDocumentIdentifier {
	uri: DocumentUri;
}

export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
	version: number;
}
export type TextDocumentContentChangeEvent = {
    text: string;
};

export interface DidChangeTextDocumentParams {
    textDocument: VersionedTextDocumentIdentifier;
    contentChanges: TextDocumentContentChangeEvent[];
}
export const document = new Map<DocumentUri,DocumentBody>();