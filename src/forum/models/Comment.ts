import {model, Schema, Document} from 'mongoose';



export interface IComment extends Document {

    user: string;
    message: string;
    dateCreated: Date;
    likes: number;
}
const commentSchema:Schema = new Schema({
    user: { type: String, required: true},
    message: { type: String, required: true},
    dateCreated: {type: Date, required: true, default: Date.now},
    likes: {type: 'Number', required: true, default: 0},
})

export const Comment = model<IComment>('Comment', commentSchema);


