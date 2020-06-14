// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

enum CommentkeyWords {
	VARIABLE,
	ENUM,
	STRUCT,
	UNION,
	FIELD,
	FUNC,
	PARAM,
	AUTHOR,
	FILE,
	BRIEF
};

const commentKeyWords: string[] = [
	"variable ", "enum ", "struct ", "union ", "field ", "func ", "param ", "file ", "author ", "brief "
];

const triggerSequence: string = "/**";

class CommentAutocompleter implements vscode.CompletionItemProvider {
	firstStar: boolean = true;

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken, context: vscode.CompletionContext)
	: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		if (context.triggerCharacter !== '@') {
			return null;
		}
		
		return [
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.VARIABLE]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.ENUM]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.STRUCT]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.UNION]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FIELD]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FUNC]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.PARAM]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.AUTHOR]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FILE]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.BRIEF]),
		];
	}
}

function inComment(activeEditor: vscode.TextEditor, activeLine: number): boolean {
	if (activeLine === 0) {
		return false;
	}

	const txt: string = activeEditor.document.lineAt(activeLine - 1).text.trim();
	if (txt.startsWith("///") && txt.startsWith("*") &&
		txt.startsWith("/**") && txt.startsWith("/*!")) {
		return true;
	} else {
		return false;
	}
}

function check(activeEditor: vscode.TextEditor, event: vscode.TextDocumentContentChangeEvent): boolean {
	if (activeEditor === undefined || activeEditor === null ||
		event === undefined || event.text === null) {
		return false;
	}
	const activeSelection: vscode.Position = activeEditor.selection.active;
	const activeLine: vscode.TextLine = activeEditor.document.lineAt(activeSelection.line);
	const activeChar: string = activeLine.text.charAt(activeSelection.character);
	const startsWith: boolean = event.text.startsWith("\n") || event.text.startsWith("\r\n");

	// Check if enter was pressed. Note the !
	if (!((activeChar === "") && startsWith)) {
		return false;
	}

	// Check if not currently in a comment block
	if (!inComment(activeEditor, activeSelection.line)) {
		return false;
	}

	// Do not trigger when there's whitespace after the trigger sequence
	// tslint:disable-next-line:max-line-length
	const seq = "[\\s]*(" + triggerSequence.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ")$";
	const match = activeLine.text.match(seq);

	if (match !== null) {
		const cont: string = match[1];
		return triggerSequence === cont;
	} else {
		return false;
	}
}
function onEvent(activeEditor: vscode.TextEditor, event: vscode.TextDocumentContentChangeEvent) {
	const lang: string = activeEditor.document.languageId;

	if (lang !== 'c') {
		console.log("No comments can be generated for language: " + lang);
		return null;
	}

	if (!check(activeEditor, event)) {
		return null;
	}

	const currentPos: vscode.Position = activeEditor.selection.active;
	const startReplace: vscode.Position = new vscode.Position(
		currentPos.line,
		currentPos.character - triggerSequence.length,
	);

	let textEditor = vscode.window.activeTextEditor;
	let fileName: string = textEditor === undefined ? "fileName" : textEditor.document.fileName;
	
	const fileDescrition: string = 
		"\n* @" + commentKeyWords[CommentkeyWords.FILE] + fileName +
		"\n* @" + commentKeyWords[CommentkeyWords.AUTHOR] + "John Doe" + 
		"\n* @" + commentKeyWords[CommentkeyWords.BRIEF] + " This file contains code about something." +
		"\n* */";
		
	const defaultDocComment: string =
		 "\n* @" + commentKeyWords[CommentkeyWords.STRUCT] + "structName" + 
		 "\n* @" + commentKeyWords[CommentkeyWords.FIELD] + "fieldName:" + 
		 "\n*\t@" + commentKeyWords[CommentkeyWords.BRIEF] + "this field describe this thing." +
		 "\n* */";
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('LT DocGen is now active!');

	vscode.window.showInformationMessage('Llamathrust DocGen extension activated!');

	vscode.workspace.onDidChangeTextDocument((event) => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && event.document === activeEditor.document) {
			onEvent(activeEditor, event.contentChanges[0]);
		}
	});

	// Autocompleter
	let autocompleter = vscode.languages.registerCompletionItemProvider('c', new CommentAutocompleter(), '@');
	context.subscriptions.push(autocompleter);
}

// this method is called when your extension is deactivated
export function deactivate() {}
