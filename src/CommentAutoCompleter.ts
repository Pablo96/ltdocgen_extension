import * as vscode from 'vscode';
import {commentKeyWords, CommentkeyWords, triggerSequence, arroba, arrobaTab } from './Commons';

export class CommentAutocompleter implements vscode.CompletionItemProvider {
	firstStar: boolean = true;
	ciAuthor : vscode.CompletionItem;
	ciBrief  : vscode.CompletionItem;
	ciNote   : vscode.CompletionItem;
	ciVar    : vscode.CompletionItem;
	ciEnum   : vscode.CompletionItem;
	ciStruct : vscode.CompletionItem;
	ciUnion  : vscode.CompletionItem;
	ciFunc   : vscode.CompletionItem;
	ciFile   : vscode.CompletionItem;
	ciField  : vscode.CompletionItem;
	ciParam  : vscode.CompletionItem;
	ciType   : vscode.CompletionItem;

	constructor() {
		this.ciAuthor = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.AUTHOR]);
		this.ciBrief  = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.BRIEF]);
		this.ciNote   = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.NOTE]);
		this.ciVar    = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.VARIABLE]);
		this.ciEnum   = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.ENUM]);
		this.ciStruct = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.STRUCT]);
		this.ciUnion  = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.UNION]);
		this.ciFunc   = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.FUNC]);
		this.ciFile   = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.FILE]);
		this.ciField  = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.FIELD]);
		this.ciParam  = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.PARAM]);
		this.ciType   = new vscode.CompletionItem(CommentkeyWords[CommentkeyWords.TYPE]);
		this.ciAuthor.insertText = new vscode.SnippetString(commentKeyWords[CommentkeyWords.AUTHOR]);
		this.ciBrief.insertText  = new vscode.SnippetString(commentKeyWords[CommentkeyWords.BRIEF]);
		this.ciNote.insertText   = new vscode.SnippetString(commentKeyWords[CommentkeyWords.NOTE]);
		this.ciVar.insertText 	 = new vscode.SnippetString(commentKeyWords[CommentkeyWords.VARIABLE]);
		this.ciEnum.insertText 	 = new vscode.SnippetString(commentKeyWords[CommentkeyWords.ENUM]);
		this.ciStruct.insertText = new vscode.SnippetString(commentKeyWords[CommentkeyWords.STRUCT]);
		this.ciUnion.insertText  = new vscode.SnippetString(commentKeyWords[CommentkeyWords.UNION]);
		this.ciFunc.insertText 	 = new vscode.SnippetString(commentKeyWords[CommentkeyWords.FUNC]);
		this.ciFile.insertText 	 = new vscode.SnippetString(commentKeyWords[CommentkeyWords.FILE]);
		this.ciField.insertText  = new vscode.SnippetString(commentKeyWords[CommentkeyWords.FIELD]);
		this.ciParam.insertText  = new vscode.SnippetString(commentKeyWords[CommentkeyWords.PARAM]);
		this.ciType.insertText 	 = new vscode.SnippetString(commentKeyWords[CommentkeyWords.TYPE]);
	}

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken, context: vscode.CompletionContext)
	: vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>
	{
		// if it wasn't  triggered by the user on purpose return
		if (context.triggerKind === vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
			return null;
		}

		// if not active editor return (added just for security but not sure if needed)
		let activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (activeEditor === undefined) {
			return null;
		}

		let activeLine: number = activeEditor.selection.active.line;

		let activeLineNotTrimmed: string = document.lineAt(activeLine).text;
		let activeLineText: string = activeLineNotTrimmed.trim();
		console.log('current line trimmed \'' + activeLineText + '\'');
		// If it isn't inside a comment return
		let invalidStartLine: boolean = (activeLineText.startsWith('*') || activeLineText.startsWith(triggerSequence));
		let invalidLine: boolean = invalidStartLine && activeLineNotTrimmed.endsWith(' ');
		console.log('current line ('+ invalidStartLine + ', ' + invalidLine + '): \'' + activeLineNotTrimmed + '\'');
		if (invalidLine) {
			return null;
		}
		
		let items = [
			this.ciAuthor,
			this.ciBrief,
			this.ciNote
		];

		let beforeLine = --activeLine;
		let lineBeforeText: string = document.lineAt(beforeLine).text.trim();

		const STRUCT_KEY: string = '@' + commentKeyWords[CommentkeyWords.STRUCT].trim();
		const UNION_KEY : string = '@' + commentKeyWords[CommentkeyWords.UNION].trim();
		const FUNC_KEY  : string = '@' + commentKeyWords[CommentkeyWords.FUNC].trim();
		const VAR_KEY   : string = '@' + commentKeyWords[CommentkeyWords.VARIABLE].trim();
		const FIELD_KEY : string = '@' + commentKeyWords[CommentkeyWords.FIELD].trim();
		const PARAM_KEY : string = '@' + commentKeyWords[CommentkeyWords.PARAM].trim();

		// if line before is a complex then include the field keyword
		if (lineBeforeText.includes(STRUCT_KEY) || lineBeforeText.includes(UNION_KEY)) {
			items.push(this.ciField);
		}
		// if line before is a function then include the param keyword
		else if (lineBeforeText.includes(FUNC_KEY)) {
			items.push(this.ciParam);
		}
		// if line before is a variable, field or parameter include the type keyword
		else if (lineBeforeText.includes(VAR_KEY) || lineBeforeText.includes(FIELD_KEY) || lineBeforeText.includes(PARAM_KEY)) {
			items.push(this.ciType);
		}
		// else we include the main keywords
		else {
			items.push(this.ciVar);
			items.push(this.ciEnum);
			items.push(this.ciStruct);
			items.push(this.ciUnion);
			items.push(this.ciFunc);
			items.push(this.ciFile);
		}
		return items;
	}

	resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
		//console.log('selected \'' + item.label + '\'');
		return null;
	}
}