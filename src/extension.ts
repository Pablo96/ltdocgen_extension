// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

enum CommentType {
	METHOD,
	COMPLEX,
	VARIABLE,
}

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

class CodeContextInfo {
	public commentType: CommentType;
	public vsAutoGenComment: boolean;

	constructor(commentType: CommentType, vsAutoGenComment: boolean) {
		this.commentType = commentType;
		this.vsAutoGenComment = vsAutoGenComment;
	}
}

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

class EventChecker {
	private disposable: vscode.Disposable;

	constructor() {
		const subscriptions: vscode.Disposable[] = [];
		vscode.workspace.onDidChangeTextDocument((event) => {
			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor && event.document === activeEditor.document) {
				this.onEvent(activeEditor, event.contentChanges[0]);
			}
		}, this, subscriptions);

		this.disposable = vscode.Disposable.from(...subscriptions);
	}

	public dispose() {
        this.disposable.dispose();
	}
	
	private onEvent(activeEditor: vscode.TextEditor, event: vscode.TextDocumentContentChangeEvent) {
		const lang: string = activeEditor.document.languageId;
		console.log("LT_DOCGEN::OnEvent");

		if (lang !== 'c') {
			console.log("No comments can be generated for language: " + lang);
			return null;
		}
	
		if (!this.check(activeEditor, event)) {
			return null;
		}
	
		console.log("LT_DOCGEN::AfterCheck");
		const currentPos: vscode.Position = activeEditor.selection.active;
		const startReplace: vscode.Position = new vscode.Position(
			currentPos.line,
			currentPos.character - triggerSequence.length,
		);
		
		const nextLineText: string = activeEditor.document.lineAt(startReplace.line + 1).text;
		const endReplace: vscode.Position = new vscode.Position(currentPos.line + 1, nextLineText.length);
	
		let textEditor = vscode.window.activeTextEditor;
		
		
	
		let info: CodeContextInfo = parse(activeEditor);
		GenerateDoc(activeEditor, info, new vscode.Range(startReplace, endReplace));
	}
	
	private inComment(activeEditor: vscode.TextEditor, activeLine: number): boolean {
		if (activeLine === 0) {
			return false;
		}

		const txt: string = activeEditor.document.lineAt(activeLine - 1).text.trim();
		if (!txt.startsWith("///") && !txt.startsWith("*") &&
			!txt.startsWith("/**") && !txt.startsWith("/*!")) {
			return false;
		} else {
			return true;
		}
	}

	private check(activeEditor: vscode.TextEditor, event: vscode.TextDocumentContentChangeEvent): boolean {
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

		// Check if currently in a comment block then dont insert comment
		if (this.inComment(activeEditor, activeSelection.line)) {
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
}

function generateComplexDescription() : string {
	const defaultComplexComment: string =
		"/**" +
		"\n* @" + commentKeyWords[CommentkeyWords.STRUCT] + "structName" + 
		"\n* @" + commentKeyWords[CommentkeyWords.FIELD] + "fieldName:" + 
		"\n*\t@" + commentKeyWords[CommentkeyWords.BRIEF] + "this field describe this thing." +
		"\n**/";
	return defaultComplexComment;
}

function generateMethodDeription() : string {
	const defaultMethodComment: string =
		"/**" +
		"\n* @" + commentKeyWords[CommentkeyWords.FUNC] + "funcName" + 
		"\n* @" + commentKeyWords[CommentkeyWords.PARAM] + "paramName:" + 
		"\n*\t@" + commentKeyWords[CommentkeyWords.BRIEF] + "this param describe this thing." +
		"\n**/";
	return defaultMethodComment;
}

function moveCursor(activeEditor: vscode.TextEditor, comment: string, baseLine: number, baseCharacter: number) {
	// Find first offset of a new line in the comment. Since that's when the line where the first param starts.
	let line: number = baseLine;
	let character: number = comment.indexOf("\n");

	// If a first line is included find the 2nd line with a newline.
	if (triggerSequence.length !== 0) {
		line++;
		const oldCharacter: number = character;
		character = comment.indexOf("\n", oldCharacter + 1) - oldCharacter;
	}

	// If newline is not found means no first param was found so Set to base line before the newline.
	if (character < 0) {
		line = baseLine;
		character = baseCharacter;
	}
	const to: vscode.Position = new vscode.Position(line, character);
	activeEditor.selection = new vscode.Selection(to, to);
}

function GenerateDoc(activeEditor: vscode.TextEditor, contextInfo: CodeContextInfo, rangeToReplace: vscode.Range) {
	let comment: string = "";
	if (contextInfo.commentType === CommentType.COMPLEX) {
		comment = generateComplexDescription();
	} else if (contextInfo.commentType === CommentType.METHOD) {
		comment = generateMethodDeription();
	}

	// overwrite any autogenerated comment closer
	let modifiedRangeToReplace = rangeToReplace;
	if (contextInfo.vsAutoGenComment) {
		const newPos: vscode.Position = new vscode.Position(
			modifiedRangeToReplace.end.line + 1,
			modifiedRangeToReplace.end.character,
		);
		modifiedRangeToReplace = new vscode.Range(rangeToReplace.start, newPos);
	}

	activeEditor.edit((editBuilder) => {
		editBuilder.replace(modifiedRangeToReplace, comment); // Insert the comment
	});

	// Set cursor to first DoxyGen command.
	moveCursor(activeEditor, comment,
		modifiedRangeToReplace.start.line,
		modifiedRangeToReplace.start.character);
}

function isVsCodeAutoComplete(line: string): boolean {
	switch (line) {
		case "*/":
			return true;
		default:
			return false;
	}
}

function parse(activeEditor: vscode.TextEditor) : CodeContextInfo {
	let vsAutoGenComment: boolean = false;
	let commentType: CommentType = CommentType.METHOD;

	vsAutoGenComment = isVsCodeAutoComplete("*/\n");
	let contextInfo = new CodeContextInfo(commentType, vsAutoGenComment);
	return contextInfo;
}


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
