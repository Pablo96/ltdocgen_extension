export enum CommentType {
	METHOD,
	COMPLEX,
	VARIABLE,
	FILE
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
	AUTHOR,
	FILE,
	BRIEF
};

export const commentKeyWords: string[] = [
	"variable ", "enum ", "struct ", "union ", "field ", "type ", "func ", "param ", "file ", "author ", "brief "
];

export const triggerSequence: string = "/**";
