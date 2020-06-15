import './Commons';
import { CommentType } from './Commons';

export class CodeContextInfo {
	public commentType: CommentType;
	public vsAutoGenComment: boolean;

	constructor(commentType: CommentType, vsAutoGenComment: boolean) {
		this.commentType = commentType;
		this.vsAutoGenComment = vsAutoGenComment;
	}
}
