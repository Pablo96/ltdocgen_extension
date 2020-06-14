// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * IntelliSense completion class
 */
class CompletionItem implements vscode.CompletionItemProvider{
	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
				token: vscode.CancellationToken, context: vscode.CompletionContext)
			: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		return [
			new vscode.CompletionItem("\n* @struct StructExample\n* */")
		];
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('LT DocGen is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let linter = vscode.commands.registerCommand('ltdocgen', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Hello World from Llamathrust DocGen!');
	});

	context.subscriptions.push(linter);

	let sel: vscode.DocumentSelector = { scheme: 'file', language: 'c' };
	let autocompleter = vscode.languages.registerCompletionItemProvider(sel, new CompletionItem());
	context.subscriptions.push(autocompleter);
}

// this method is called when your extension is deactivated
export function deactivate() {}
