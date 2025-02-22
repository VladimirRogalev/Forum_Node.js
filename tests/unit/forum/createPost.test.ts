import PostServiceImpl from '../../../src/forum/service/PostServiceImpl';
import {Post} from '../../../src/forum/models/Post';
import PostDto from '../../../src/forum/dto/PostDto';

jest.mock('../../../src/forum/models/Post');

describe('PostServiceImpl.addComment', () => {
    let postService: PostServiceImpl;

    beforeEach(() => {
        postService = new PostServiceImpl();
    });

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it('Passed test', async () => {
        const id = '67b08814ab0490cd0399c60b'
        const fakePostDto = {
            id: id,
            title: 'Test title',
            content: 'Test Content',
            tags:['node', 'jest'],
            author: 'Test Author',
            dateCreated: new Date('2025-02-22'),
            likes: 10,
            comments: [{
                user: 'Test User',
                message: 'Test Message',
                dateCreated: new Date('2025-02-22'),
                likes: 1
            }]
        };
        (Post.prototype.save as jest.Mock).mockResolvedValue(fakePostDto);
        const result = await postService.createPost(fakePostDto.author, fakePostDto.title, fakePostDto.content, new Set(fakePostDto.tags));



        expect(result).toBeInstanceOf(PostDto);
        expect(result.id).toEqual(fakePostDto.id);
        expect(result.title).toEqual(fakePostDto.title);
        expect(result.content).toEqual(fakePostDto.content);
        expect(result.author).toEqual(fakePostDto.author);
        // expect(result.dateCreated).toEqual(fakePostDto.dateCreated);
        expect(result.tags).toEqual(fakePostDto.tags);
        expect(result.likes).toEqual(fakePostDto.likes);
        expect(result.comments).toEqual(fakePostDto.comments);

    });
    it('Failed test', async () => {
        (Post.prototype.save as jest.Mock).mockRejectedValue(new Error(("Database error")));
        await expect(postService.createPost("Test Author", "Test Title", "Test Content", new Set<string>(['tag1', 'tag2']))).rejects.toThrow(`Database error`);

    });
});