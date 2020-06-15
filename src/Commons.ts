export enum CommentType {
	METHOD,
	COMPLEX,
	VARIABLE,
	FILE,
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
	AUTHOR,
	FILE,
	BRIEF,
	NOTE
};

export const commentKeyWords: string[] = [
	"variable ", "enum ", "struct ", "union ", "field ", "type ", "func ", "param ", "file ", "author ", "brief ", "note "
];

export const triggerSequence: string = "/**";
