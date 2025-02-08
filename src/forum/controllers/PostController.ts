import {Body, Controller, Delete, Get, Param, Post, Put, Res} from 'routing-controllers';
import NewPostDto from '../dto/NewPostDto';
import PostServiceImpl from '../service/PostServiceImpl';
import PostService from '../service/PostService';
import {Response} from 'express';


@Controller('/forum')
export default class PostController {
    postService: PostService = new PostServiceImpl();

    @Post('/post/:author')
    async createPost(@Param('author') author: string, @Body() newPostDto: NewPostDto) {
        return await this.postService.createPost(author, newPostDto.title, newPostDto.content, newPostDto.tags);
    }

    @Get('/post/:id')
    async findPostById(@Param('id') id: string, @Res() res: Response) {
        return await this.postService.findPostById(id).catch(err =>res.status(404).send(err))
    }

    @Put("/post/:id")
    async updatePostById (@Param('id') id: string, @Body() newPostDto: NewPostDto, @Res() res: Response) {
        return await  this.postService.updatePostById(id, newPostDto.title, newPostDto.content, newPostDto.tags).catch((err: any)=> res.status(404).send(err))
    }
    @Delete("/post/:id")
    async  removePostById(@Param('id') id:string, @Res() res: Response){
        return await this.postService.removePostById(id).catch((err: any) =>res.status(404).send(err))
    }

}



