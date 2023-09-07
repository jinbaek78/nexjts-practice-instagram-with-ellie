import {
  getFollowingPostsOf,
  getLikedPostsOf,
  getPost,
  getPostsOf,
  getSavedPostsOf,
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
  },
  urlFor: jest.fn(),
}));

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

  const fetchQuery = `*[_type == "post" && author->username == "${username}"
  || author._ref in *[_type == "user" && username == "${username}"].following[]._ref]
  | order(_createdAt desc){${simplePostProjection}}
  `;

  afterEach(() => {
    (client.fetch as jest.Mock).mockReset();
    (urlFor as jest.Mock).mockReset();
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
});
