package lsp

type TextDocumentItem struct {
	/**
	 * The text document's URI.
	 */
	URI string `json:"uri"`

	/**
	 * The text document's language identifier.
	 */
	LanguageID string `json:"languageId"`

	/**
	 * The version number of this document (it will increase after each
	 * change, including undo/redo).
	 */
	Version int `json:"version"`

	/**
	 * The content of the opened text document.
	 */
	Text string `json:"string"`
}

type DidOpenTextDocumentNotification struct {
	Notification
	Params DidOpenTextDocumentParams
}

type DidOpenTextDocumentParams struct {
	/**
	 * The document that was opened.
	 */
	TextDocument TextDocumentItem `json:"textDocument"`
}
