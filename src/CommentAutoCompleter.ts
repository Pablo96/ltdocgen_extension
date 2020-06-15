import * as vscode from 'vscode';
import {commentKeyWords, CommentkeyWords, triggerSequence, arroba, arrobaTab } from './Commons';
import { activate } from './extension';

export class CommentAutocompleter implements vscode.CompletionItemProvider {
	firstStar: boolean = true;

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken, context: vscode.CompletionContext)
	: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		// if it wasn't  triggered by the user on purpose return
		if (context.triggerCharacter !== '@') {
			return null;
		}

		// if not active editor return (added just for security but not sure if needed)
		let activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (activeEditor === undefined) {
			return null;
		}

		let activeLine: number = activeEditor.selection.active.line;

		// If it isn't inside a comment return
		let activeLineText = document.lineAt(activeLine).text.trim();
		if (!activeLineText.startsWith(triggerSequence)
			&& !activeLineText.startsWith('*')) {
			return null;
		}
		
		let items = [
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.AUTHOR]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.BRIEF]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.NOTE])
		];

		let beforeLine = --activeLine;
		let lineBeforeText: string = document.lineAt(beforeLine).text.trim();
		console.log('LineBefore (number: ' + beforeLine + '):\n\t\'' + lineBeforeText + '\'');

		const STRUCT_KEY: string = '@' + commentKeyWords[CommentkeyWords.STRUCT].trim();
		const UNION_KEY: string = '@' + commentKeyWords[CommentkeyWords.UNION].trim();
		const FUNC_KEY: string = '@' + commentKeyWords[CommentkeyWords.FUNC].trim();
		const VAR_KEY: string = '@' + commentKeyWords[CommentkeyWords.VARIABLE].trim();
		const FIELD_KEY: string = '@' + commentKeyWords[CommentkeyWords.FIELD].trim();
		const PARAM_KEY: string = '@' + commentKeyWords[CommentkeyWords.PARAM].trim();

		// if line before is a complex then include the field keyword
		if (lineBeforeText.includes(STRUCT_KEY) || lineBeforeText.includes(UNION_KEY)) {
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FIELD]));
		}
		// if line before is a function then include the param keyword
		else if (lineBeforeText.includes(FUNC_KEY)) {
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.PARAM]));
		}
		// if line before is a variable, field or parameter include the type keyword
		else if (lineBeforeText.includes(VAR_KEY) || lineBeforeText.includes(FIELD_KEY) || lineBeforeText.includes(PARAM_KEY)) {
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.TYPE]));
		}
		// else we include the main keywords
		else {
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.VARIABLE]));
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.ENUM]));
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.STRUCT]));
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.UNION]));
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FUNC]));
			items.push(new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FILE]));
		}
		return items;
	}

	resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
		return null;
	}
}