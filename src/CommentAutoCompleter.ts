import * as vscode from 'vscode';
import {commentKeyWords, CommentkeyWords } from './Commons';

export class CommentAutocompleter implements vscode.CompletionItemProvider {
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
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.TYPE]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.PARAM]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.AUTHOR]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.FILE]),
			new vscode.CompletionItem(commentKeyWords[CommentkeyWords.BRIEF]),
		];
	}
}