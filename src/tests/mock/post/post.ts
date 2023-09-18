import { Comment, FullPost, SimplePost } from '@/model/post';

export const fakeSimplePost: SimplePost = {
  username: 'testUser1',
  userImage: '/testUserImage1',
  image: '/testImage1',
  likes: ['testUser1', 'testUser2'],
  text: 'test',
  comments: 1,
  id: 'testId1',
  createdAt: '2023-08',
};

export const fakeSimplePosts: SimplePost[] = [
  {
    username: 'testUser1',
    userImage: '/testUserImage1',
    image: '/testImage1',
    likes: ['testUser1'],
    text: 'test1',
    comments: 1,
    id: 'testId1',
    createdAt: '2023-08-01',
  },
  {
    username: 'testUser2',
    userImage: '/testUserImage2',
    image: '/testImage2',
    likes: ['testUser2', 'testUser3', 'testUsername'],
    text: 'test2',
    comments: 2,
    id: 'testId2',
    createdAt: '2023-08-02',
  },
  {
    username: 'testUser3',
    userImage: '/testUserImage3',
    image: '/testImage3',
    likes: ['testUser3', 'testUser4'],
    text: '',
    comments: 3,
    id: 'testId3',
    createdAt: '2023-08-03',
  },
];

export const fakeFullPost: FullPost = {
  username: 'testUser1',
  userImage: '/testUserImage1',
  image: '/testImage1',
  likes: ['testUser1', 'testUser2'],
  text: 'test',
  comments: [{ username: 'testUser1', comment: 'test', image: '/test1' }],
  id: 'testId1',
  createdAt: '2023-08',
};

export const fakeFullPosts: FullPost[] = [
  {
    username: 'testUser1',
    userImage: '/testUserImage1',
    image: '/testImage1',
    likes: ['testUser1', 'testUser2'],
    text: 'test',
    comments: [{ username: 'testUser1', comment: 'test', image: '/test1' }],
    id: 'testId1',
    createdAt: '2023-08',
  },
  {
    username: 'testUser2',
    userImage: '/testUserImage2',
    image: '/testImage2',
    likes: ['testUser1', 'testUser2'],
    text: 'test',
    comments: [{ username: 'testUser1', comment: 'test', image: '/test1' }],
    id: 'testId2',
    createdAt: '2023-09',
  },
];

export const fakeComment: Comment = {
  comment: 'testComment',
  username: 'testUsername',
  image: '/testImage',
};
