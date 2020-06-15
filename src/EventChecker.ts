import * as vscode from 'vscode';
import { triggerSequence } from './Commons';
import { CodeContextInfo } from './CodeContextInfo';
import { parse, GenerateDoc } from './Parser';

export class EventChecker {
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
