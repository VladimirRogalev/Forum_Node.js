import PostService from './PostService';
import PostDto from '../dto/PostDto';
import {Post as P} from '../models/Post';
import CommentDto from '../dto/CommentDto';
import {NotFoundError, Param} from 'routing-controllers';
import { Types} from 'mongoose';
import * as mongoose from 'mongoose';

export default class PostServiceImpl implements PostService {
    async createPost(author: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        const newPost = new P ({
            title: title,
            content: content,
            tags: tags,
            author: author});
        const res =  await newPost.save();
        const resultPostDto : PostDto= new PostDto(res.id, res.title, res.content, res.author, res.dataCreated,Array.from(res.tags), res.likes,
            res.comments.map(c=> c as unknown as  CommentDto ))
        return resultPostDto   // todo
    }
    async findPostById (id: string ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        const post = await P.findById(id);
        if(post === null){
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dataCreated,Array.from(post.tags), post.likes,
            post.comments.map(c=> c as unknown as  CommentDto ))
        return postDto
    }

    async removePostById(id: string): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        const post = await P.findById(id);
        if(post === null){
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        await post.deleteOne();
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dataCreated,Array.from(post.tags), post.likes,
            post.comments.map(c=> c as unknown as  CommentDto ))
        return postDto

    }

    async updatePostById(id: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        const post = await P.findById(id);
        if(post === null){
            throw new NotFoundError(`Post with id ${id} not found`)
        }
        post.title = title;
        post.content = content;
        post.tags = tags;
        await post.save();
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dataCreated,Array.from(post.tags), post.likes,
            post.comments.map(c=> c as unknown as  CommentDto ))
        return postDto
    }

}