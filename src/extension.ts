// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EventChecker } from './EventChecker';
import { CommentAutocompleter } from './CommentAutoCompleter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('LT DocGen is now active!');

	vscode.window.showInformationMessage('Llamathrust DocGen extension activated!');

	// Comment injector
	let disposable = new EventChecker();
	context.subscriptions.push(disposable);

	// Autocompleter
	let autocompleter = vscode.languages.registerCompletionItemProvider('c', new CommentAutocompleter(), '@');
	context.subscriptions.push(autocompleter);
}

// this method is called when your extension is deactivated
export function deactivate() {}
