import PostDto from '../dto/PostDto';


export default interface PostService {
     createPost(author: string, title: string, content: string, tags: Set<string>) : Promise<PostDto>;
     findPostById(id:string): Promise<PostDto>;

}
