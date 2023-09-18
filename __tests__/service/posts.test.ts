import {
  addComment,
  dislikePost,
  getFollowingPostsOf,
  getLikedPostsOf,
  getPost,
  getPostsOf,
  getSavedPostsOf,
  likePost,
} from '@/service/posts';
import { client, urlFor } from '@/service/sanity';
import {
  fakeFullPost,
  fakeFullPosts,
  fakeSimplePosts,
} from '@/tests/mock/post/post';
import { fakeSession } from '@/tests/mock/user/session';

jest.mock('@/service/sanity', () => ({
  client: {
    fetch: jest.fn(),
    patch: jest.fn(),
  },
  urlFor: jest.fn(),
}));

// jest.mock('@/service/sanity', () => ({
//   client: {
//     fetch: jest.fn(),
//     patch: jest.fn(),
//     setIfMissing: jest.fn(),
//     append: jest.fn(),
//     commit: jest.fn(),
//   },
//   urlFor: jest.fn(),
// }));

const simplePostProjection = `
  ...,
  "username": author->username,
  "userImage": author->image,
  "image": photo,
  "likes": likes[]->username,
  "text": comments[0].comment,
  "comments": count(comments),
  "id": _id,
  "createdAt": _createdAt
`;

describe('PostService', () => {
  const {
    user: { username },
  } = fakeSession;

  const commit = jest.fn();

  const fetchQuery = `*[_type == "post" && author->username == "${username}"
  || author._ref in *[_type == "user" && username == "${username}"].following[]._ref]
  | order(_createdAt desc){${simplePostProjection}}
  `;

  afterEach(() => {
    (client.patch as jest.Mock).mockReset();
    (client.fetch as jest.Mock).mockReset();
    (urlFor as jest.Mock).mockReset();
    commit.mockClear();
  });

  describe('getFollowingPostsOf', () => {
    it('should invoke fetch and urlFor method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(
        async () => fakeSimplePosts
      );
      const result = await getFollowingPostsOf(username);

      expect(urlFor).toHaveBeenCalledTimes(fakeSimplePosts.length);
      expect((urlFor as jest.Mock).mock.calls[0][0]).toBe(
        fakeSimplePosts[0].image
      );
      expect((urlFor as jest.Mock).mock.calls[1][0]).toBe(
        fakeSimplePosts[1].image
      );
      expect(client.fetch).toHaveBeenCalledTimes(1);
      // expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
      //   `order(_createdAt desc){${simplePostProjection}}`
      // );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `"comments": count(comments),`
      );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        ` author._ref in *[_type == "user" && username == "${username}"]`
      );

      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `*[_type == "post" && author->username == "${username}`
      );
      expect(result).toEqual(
        fakeSimplePosts.map((post) => ({ ...post, image: undefined }))
      );
    });
  });

  describe('getPost', () => {
    const { id } = fakeFullPost;
    it('should invoke fetch and urlFor method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(async () => fakeFullPost);
      const result = await getPost(id);

      expect(urlFor).toHaveBeenCalledTimes(1);
      expect((urlFor as jest.Mock).mock.calls[0][0]).toBe(fakeFullPost.image);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `*[_type == "post" && _id == "${id}"][0]`
      );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `comments[]{comment, "username": author->username, "image": author->image}`
      );

      expect(result).toEqual({ ...fakeFullPost, image: undefined });
    });
  });

  describe('getPostsOf', () => {
    const { id } = fakeFullPost;
    it('should invoke fetch and urlFor method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(async () => [
        fakeFullPost,
      ]);
      const username = 'testUsername';
      const result = await getPostsOf(username);

      expect(urlFor).toHaveBeenCalledTimes(1);
      expect((urlFor as jest.Mock).mock.calls[0][0]).toBe(fakeFullPost.image);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `*[_type == "post" && author->username == "${username}"]`
      );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        simplePostProjection
      );

      expect(result).toEqual([{ ...fakeFullPost, image: undefined }]);
    });
  });

  describe('getLikedPostsOf', () => {
    const { id } = fakeFullPost;
    it('should invoke fetch and urlFor method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(async () => [
        fakeFullPost,
      ]);
      const username = 'testUsername';
      const result = await getLikedPostsOf(username);

      expect(urlFor).toHaveBeenCalledTimes(1);
      expect((urlFor as jest.Mock).mock.calls[0][0]).toBe(fakeFullPost.image);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `*[_type == "post" && "${username}" in likes[]->username]`
      );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        simplePostProjection
      );

      expect(result).toEqual([{ ...fakeFullPost, image: undefined }]);
    });
  });

  describe('getSavedPostsOf', () => {
    const { id } = fakeFullPost;
    it('should invoke fetch and urlFor method with correct query', async () => {
      (client.fetch as jest.Mock).mockImplementation(async () => [
        fakeFullPost,
      ]);
      const username = 'testUsername';
      const result = await getSavedPostsOf(username);

      expect(urlFor).toHaveBeenCalledTimes(1);
      expect((urlFor as jest.Mock).mock.calls[0][0]).toBe(fakeFullPost.image);

      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        `*[_type == "post" && _id in *[_type=="user" && username=="${username}"].bookmarks[]._ref]`
      );
      expect((client.fetch as jest.Mock).mock.calls[0][0]).toContain(
        simplePostProjection
      );

      expect(result).toEqual([{ ...fakeFullPost, image: undefined }]);
    });
  });

  describe('likePost', () => {
    it('should correctly invoke client methods with the expected arguments', async () => {
      (client.patch as jest.Mock).mockImplementation(() => ({
        setIfMissing,
      }));
      const append = jest.fn().mockImplementation(() => ({ commit }));
      const setIfMissing = jest.fn().mockImplementation(() => ({ append }));
      const postId = 'testPost';
      const userId = 'testUser';
      const setIfMissingArguments = { likes: [] };
      const appendArguments = [
        'likes',
        [
          {
            _ref: userId,
            _type: 'reference',
          },
        ],
      ];
      const commitArguments = { autoGenerateArrayKeys: true };

      await likePost(postId, userId);

      expect(client.patch).toHaveBeenCalledTimes(1);
      expect(client.patch).toHaveBeenCalledWith(postId);
      expect(setIfMissing).toHaveBeenCalledTimes(1);
      expect(setIfMissing).toHaveBeenCalledWith(setIfMissingArguments);
      expect(append).toHaveBeenCalledTimes(1);
      expect(append).toHaveBeenCalledWith(
        appendArguments[0],
        appendArguments[1]
      );
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(commitArguments);
    });
  });
  describe('dislikePost', () => {
    it('should correctly invoke client methods with the expected arguments', async () => {
      const unset = jest.fn().mockImplementation(() => ({ commit }));
      (client.patch as jest.Mock).mockImplementation(() => ({
        unset,
      }));
      const postId = 'testPost';
      const userId = 'testUser';
      const unsetArguments = [`likes[_ref=="${userId}"]`];

      await dislikePost(postId, userId);

      expect(client.patch).toHaveBeenCalledTimes(1);
      expect(client.patch).toHaveBeenCalledWith(postId);
      expect(unset).toHaveBeenCalledTimes(1);
      expect(unset).toHaveBeenCalledWith(unsetArguments);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith();
    });
  });

  describe('addComment', () => {
    it.only('should correctly invoke client methods with the expected arguments', async () => {
      (client.patch as jest.Mock).mockImplementation(() => ({
        setIfMissing,
      }));
      const append = jest.fn().mockImplementation(() => ({ commit }));
      const setIfMissing = jest.fn().mockImplementation(() => ({ append }));
      const postId = 'testPost';
      const userId = 'testUser';
      const comment = 'testComment';
      const setIfMissingArguments = { comments: [] };
      const appendArguments = [
        'comments',
        [
          {
            comment,
            author: {
              _ref: userId,
              _type: 'reference',
            },
          },
        ],
      ];
      const commitArguments = { autoGenerateArrayKeys: true };

      await addComment(postId, userId, comment);

      expect(client.patch).toHaveBeenCalledTimes(1);
      expect(client.patch).toHaveBeenCalledWith(postId);
      expect(setIfMissing).toHaveBeenCalledTimes(1);
      expect(setIfMissing).toHaveBeenCalledWith(setIfMissingArguments);
      expect(append).toHaveBeenCalledTimes(1);
      expect(append).toHaveBeenCalledWith(
        appendArguments[0],
        appendArguments[1]
      );
      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(commitArguments);
    });
  });
});
