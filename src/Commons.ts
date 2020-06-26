export enum CommentType {
	METHOD,
	COMPLEX,
	VARIABLE,
	FILE,
	DEF,
	ENUM,
	UNKNOWN
}

export enum CommentkeyWords {
	VARIABLE,
	ENUM,
	STRUCT,
	UNION,
	FIELD,
	TYPE,
	FUNC,
	PARAM,
	FILE,
	AUTHOR,
	BRIEF,
	NOTE,
	DEF,
	TAG
};

export const commentKeyWords: string[] = [
	"var ", "enum ", "struct ", "union ", "field ", "type ", "func ", "param ", "file ", "author ", "brief ", "note ", "def ", "tag "
];

export const triggerSequence: string = "/**";
export const arroba: string = "\n * @";
export const arrobaTab: string = "\n *\t\t@";
export const endLine: string = "\n **/";
