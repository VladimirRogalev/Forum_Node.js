import PostServiceImpl from '../../../src/forum/service/PostServiceImpl';
import {Post} from '../../../src/forum/models/Post';
import PostDto from '../../../src/forum/dto/PostDto';

jest.mock('../../../src/forum/models/Post');

describe('PostServiceImpl.getAllPosts', () => {
    let postService: PostServiceImpl;

    beforeEach(() => {
        postService = new PostServiceImpl();
    });

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it('Passed test', async () => {
        const fakePostDto = [{
            id: '67b08814ab0490cd0399c60b',
            title: 'Test title',
            content: 'Test Content',
            tags: ['node', 'jest'],
            author: 'Tst Author',
            dateCreated: new Date('2025-02-21'),
            likes: 10,
            comments: [{
                user: 'Test user', message: 'Test message', dateCreated: new Date('2025-02-21'), likes: 1
            }]
        }];
        (Post.find as jest.Mock).mockResolvedValue([...fakePostDto]);
        const result = await postService.getAllPosts();

        expect(Post.find).toHaveBeenCalled()

        // const firstFakePost = result[0];
        expect(result[0]).toBeInstanceOf(PostDto);
        expect(result[0].id).toEqual(fakePostDto[0].id);
        expect(result[0].title).toEqual(fakePostDto[0].title);
        expect(result[0].content).toEqual(fakePostDto[0].content);
        expect(result[0].author).toEqual(fakePostDto[0].author);
        expect(result[0].dateCreated).toEqual(fakePostDto[0].dateCreated);
        expect(result[0].tags).toEqual(fakePostDto[0].tags);
        expect(result[0].likes).toEqual(fakePostDto[0].likes);
        expect(result[0].comments).toEqual(fakePostDto[0].comments);

    });
    it('Posts not found', async () => {
        (Post.find as jest.Mock).mockResolvedValue([]);
        await expect(postService.getAllPosts()).rejects.toThrow(`Posts not found`);

    });
});