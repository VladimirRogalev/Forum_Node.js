import PostServiceImpl from '../../../src/forum/service/PostServiceImpl';
import {Post} from '../../../src/forum/models/Post';
import PostDto from '../../../src/forum/dto/PostDto';

jest.mock('../../../src/forum/models/Post');

describe('PostServiceImpl.addComment', () => {
    let postService: PostServiceImpl;
    const unknown = 'UNKNOWN';

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
            tags: ['node', 'jest'],
            author: 'Tst Author',
            dataCreated: new Date('2025-02-21'),
            likes: 10,
            comments: [{
                user: 'Test User',
                message: 'Test Message',
                dateCreated: new Date('2025-02-21'),
                likes: 1
            }]
        };
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue(fakePostDto);
        const result = await postService.addComment("67b08814ab0490cd0399c60b", "Test User", "Test Message");

        expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(id,
            {
                $push: {
                    comments: {
                        user:"Test User",
                        message:"Test Message",
                        likes: 0,
                    },
                },
            },
            { new: true });

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
    it('Failed test', async () => {
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
        await expect(postService.addComment("UNKNOWN", "USER", "MESSAGE")).rejects.toThrow(`Post with id ${unknown} not found`);

    });
});