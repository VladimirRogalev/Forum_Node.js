import PostService from './PostService';
import PostDto from '../dto/PostDto';
import {Post as P} from '../models/Post';
import CommentDto from '../dto/CommentDto';
import {Param} from 'routing-controllers';

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
        const post = await P.findById(id)
        if (post ===null) {
            throw  new Error( 'post is null')
        }
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dataCreated,Array.from(post.tags), post.likes,
            post.comments.map(c=> c as unknown as  CommentDto ))
        return postDto
    }

}