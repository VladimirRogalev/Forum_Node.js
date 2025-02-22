import PostServiceImpl from '../../../src/forum/service/PostServiceImpl';
import {Post} from '../../../src/forum/models/Post';
import PostDto from '../../../src/forum/dto/PostDto';

jest.mock('../../../src/forum/models/Post');

describe('PostServiceImpl.findPostById', () => {
    let postService: PostServiceImpl;
    const unknown = 'Unknown';

    beforeEach(() => {
        postService = new PostServiceImpl();
    });

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it('Passed test', async () => {
        const fakePostDto = {
            id: '67b08814ab0490cd0399c60b',
            title: 'Test title',
            content: 'Test Content',
            tags: ['node', 'jest'],
            author: 'Tst Author',
            dataCreated: new Date('2025-02-21'),
            likes: 10,
            comments: [{
                user: 'Test user', message: 'Test message', dateCreated: new Date('2025-02-21'), likes: 1
            }]
        };
        (Post.findById as jest.Mock).mockResolvedValue(fakePostDto);
        const result = await postService.findPostById('67b08814ab0490cd0399c60b');

        expect(Post.findById).toHaveBeenCalledWith("67b08814ab0490cd0399c60b")

         expect(result).toBeInstanceOf(PostDto);
         expect(result.id).toEqual(fakePostDto.id);
         expect(result.title).toEqual(fakePostDto.title);
         expect(result.content).toEqual(fakePostDto.content);
         expect(result.author).toEqual(fakePostDto.author);
         expect(result.dateCreated).toEqual(fakePostDto.dataCreated);
         expect(result.tags).toEqual(fakePostDto.tags);
         expect(result.likes).toEqual(fakePostDto.likes);
         expect(result.comments).toEqual(fakePostDto.comments);

    });
    it('Not valid Id', async () => {
        (Post.findById as jest.Mock).mockResolvedValue(null);
        await expect(postService.findPostById(unknown)).rejects.toThrow(`Post with id ${unknown} not found`);

    });
});