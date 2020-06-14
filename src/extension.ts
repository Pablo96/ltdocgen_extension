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

let commentKeyWords: string[] = [
	"variable ", "enum ", "struct ", "union ", "field ", "func ", "param ", "file ", "author ", "brief "
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('LT DocGen is now active!');

	vscode.window.showInformationMessage('Llamathrust DocGen extension activated!');

	// Autocompleter
	let autocompleter = vscode.languages.registerCompletionItemProvider('c', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
			token: vscode.CancellationToken, context: vscode.CompletionContext)
		: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
		{
			if (context.triggerCharacter === '@') {
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
			} else if (context.triggerCharacter === '*') {
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
				return [
					new vscode.CompletionItem(fileDescrition),
					new vscode.CompletionItem(defaultDocComment)
				];
			} else if (context.triggerCharacter === '/') {
				return null;
			} else {
				return null;
			}
		}
	}, '@', '/', '*');
	context.subscriptions.push(autocompleter);
}

// this method is called when your extension is deactivated
export function deactivate() {}
