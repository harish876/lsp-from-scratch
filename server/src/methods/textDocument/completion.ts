import { RequestMessage } from "../../server";
import * as fs from "fs";
import {
    document,
    TextDocumentContentChangeEvent,
    VersionedTextDocumentIdentifier,
    DocumentUri
} from "../../documents";
import log from "../../log";

interface TextDocumentIdentifier {
    uri: DocumentUri;
}
interface Position {
    line: number;
    character: number;
}

interface TextDocumentPositionParams {
    textDocument: TextDocumentIdentifier;
    position: Position;
}
export interface CompletionParams extends TextDocumentPositionParams {

}

const words = fs
    .readFileSync("/usr/share/dict/web2")
    .toString()
    .split("\n")

const items: CompletionItem[] = words
    .map((word: string) => {
        return { label: word };
    });

interface CompletionItem {
    label: string;
}

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

export function completion(request: RequestMessage): CompletionList | null {
    const params = request.params as CompletionParams;
    const content = document.get(params.textDocument.uri)

    if (!content) {
        return null
    }
    const currentLine = content?.split("\n")[params.position.line]
    const lineUntilCursor = currentLine.slice(0, params.position.character)
    const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1")

    const newItems = words
        .filter(word => word.startsWith(currentPrefix))
        .slice(0, 1000)
        .map((word: string) => { return { label: word }; });


    return {
        isIncomplete: true,
        items: newItems,
    };
}
