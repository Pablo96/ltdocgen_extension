import * as vscode from 'vscode';
import {commentKeyWords, CommentkeyWords, triggerSequence, arroba, arrobaTab } from './Commons';
import { activate } from './extension';

export class CommentAutocompleter implements vscode.CompletionItemProvider {
	firstStar: boolean = true;

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken, context: vscode.CompletionContext)
	: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		if (context.triggerCharacter !== '@') {
			return null;
		}

		let activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (activeEditor === undefined) {
			return null;
		}

		let addNewLine: boolean = false;

		let activeLine: number = activeEditor.selection.active.line;
		let activeLineText = document.lineAt(activeLine).text.trim();
		
		if (activeLineText.startsWith(triggerSequence)) {
			activeLine++;
			activeLineText = document.lineAt(activeLine).text.trim();
			if (activeLineText.endsWith('*/')) {
				addNewLine = true;
				activeLine--;
				activeLineText = document.lineAt(activeLine).text.trim();
			}
		} else if (activeLineText.endsWith('*/')) {
			activeLine--;
			activeLineText = document.lineAt(activeLine).text.trim();
			if (activeLineText.startsWith(triggerSequence)) {
				addNewLine = true;
			}
		} else if (!activeLineText.startsWith('*')) {
			return null;
		}
		
		let newLine: string = addNewLine? arroba : "";

		return [
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.VARIABLE]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.ENUM]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.STRUCT]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.UNION]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.FIELD]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.FUNC]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.PARAM]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.AUTHOR]),
			new vscode.CompletionItem(newLine + commentKeyWords[CommentkeyWords.FILE]),
			new vscode.CompletionItem((addNewLine? arrobaTab : "") + commentKeyWords[CommentkeyWords.BRIEF]),
			new vscode.CompletionItem((addNewLine? arrobaTab : "") + commentKeyWords[CommentkeyWords.TYPE]),
		];
	}
}