import PostService from './PostService';
import PostDto from '../dto/PostDto';
import {Post as P} from '../models/Post';
import CommentDto from '../dto/CommentDto';
import {NotFoundError} from 'routing-controllers';
import {Types} from 'mongoose';

export default class PostServiceImpl implements PostService {
    async createPost(author: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        const newPost = new P({
            title: title,
            content: content,
            tags: tags,
            author: author
        });
        const res = await newPost.save();
        const resultPostDto: PostDto = new PostDto(res.id, res.title, res.content, res.author, res.dateCreated, Array.from(res.tags), res.likes,
            res.comments.map(c => c as unknown as CommentDto));
        return resultPostDto;
    }

    async findPostById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const post = await P.findById(id);
        if (post === null) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
            post.comments.map(c => c as unknown as CommentDto));
        return postDto;
    }

    async removePostById(id: string): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const post = await P.findById(id);
        if (post === null) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        await post.deleteOne();
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
            post.comments.map(c => c as unknown as CommentDto));
        return postDto;

    }

    async updatePostById(id: string, title: string, content: string, tags: Set<string>): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const post = await P.findById(id);
        if (post === null) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        post.title = title;
        post.content = content;
        post.tags = tags;
        await post.save();
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
            post.comments.map(c => c as unknown as CommentDto));
        return postDto;
    }

    async getAllPosts(): Promise<PostDto[]> {
        const posts = await P.find();
        if (posts.length === 0) {
            throw new NotFoundError(`Posts not found`);
        }
        const postDto: PostDto[] = posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
        return postDto;
    }

    async findPostsByAuthor(author: string): Promise<PostDto[]> {
        const posts = await P.find({author: author});
        if (posts.length === 0) {
            throw new NotFoundError(`Post with author ${author} not found`);
        }
        const postDto: PostDto[] = posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
                post.comments.map(c => c as unknown as CommentDto)
            );
        });
        return postDto;
    }

    async addComment(id: string, user: string, message: string): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const post = await P.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: {
                        user,
                        message,
                        likes: 0,
                    },
                },
            },
            {new: true}
        );
        if (post === null) {
            throw new Error('post is null');
        }
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
            post.comments.map(c => c as CommentDto));
        return postDto;
    }

    async findPostsByTags(tags: string[]): Promise<PostDto[]> {
        const posts = await P.find({tags: {$in: tags}});

        const postDto: PostDto[] = posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
                post.comments.map(c => c as CommentDto)
            );
        });
        return postDto;
    }

    async findPostsByPeriod(dateFrom: Date, dateTo: Date): Promise<PostDto[]> {
        const posts = await P.find({
            dataCreated: {
                $gte: dateFrom,
                $lte: dateTo
            }
        });
        const postDto: PostDto[] = posts.map(post => {
            return new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
                post.comments.map(c => c as CommentDto)
            );
        });
        return postDto;
    }

    async addLike(id: string): Promise<PostDto> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        const post = await P.findById(id);
        if (post === null) {
            throw new NotFoundError(`Post with id ${id} not found`);
        }
        post.likes++;

        await post.save();
        const postDto = new PostDto(post.id, post.title, post.content, post.author, post.dateCreated, Array.from(post.tags), post.likes,
            post.comments.map(c => c as CommentDto));
        return postDto;
    }

}