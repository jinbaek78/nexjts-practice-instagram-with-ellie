import { HomeUser, ProfileUser, SearchUser } from '@/model/user';

const simpleUser1 = { username: 'simpleUser1', image: '/simpleUser1' };
const simpleUser2 = { username: 'simpleUser2', image: '/simpleUser2' };

export const fakeProfileUser: ProfileUser = {
  id: 'testId',
  name: 'homeUser',
  username: 'homeUsername',
  email: 'homeUsername@gmail.com',
  image: '/image/homeUsername',
  //
  following: 0,
  followers: 1,
  posts: 2,
};

export const fakeProfileUsers: ProfileUser[] = [
  {
    id: 'testUserId1',
    name: 'fakeProfileUser1',
    username: 'fakeProfileUser1',
    email: 'fakeProfileUser1@gmail.com',
    image: '/fakeProfileUser1',
    //
    following: 2,
    followers: 1,
    posts: 1,
  },
  {
    id: 'testUserId2',
    name: 'fakeProfileUser2',
    username: 'fakeProfileUser2',
    email: 'fakeProfileUser2@gmail.com',
    image: '/fakeProfileUser2',
    //
    following: 2,
    followers: 2,
    posts: 2,
  },
];
export const fakeHomeUser: HomeUser = {
  id: 'testId',
  name: 'homeUser',
  username: 'homeUsername',
  email: 'homeUsername@gmail.com',
  image: '/image/homeUsername',
  //
  following: [simpleUser1, fakeProfileUsers[0]],
  followers: [],
  bookmarks: [],
};

export const fakeHomeUsers: HomeUser[] = [
  {
    id: 'testId1',
    name: 'testName1',
    username: 'testUser1',
    email: 'testEmail@gmail.com',
    image: '/testImage',
    //
    following: [simpleUser1],
    followers: [],
    bookmarks: ['testPost1', 'testPost2'],
  },
  {
    id: 'testId2',
    name: 'testName2',
    username: 'testUser2',
    email: 'testEmail2@gmail.com',
    image: '/testImage2',
    //
    following: [simpleUser1, fakeProfileUsers[0]],
    followers: [],
    bookmarks: ['testPost1', 'testPost2', 'testPost'],
  },
];

export const fakeSearchUser: SearchUser = {
  id: 'testId1',
  name: 'testName1',
  username: 'testUser1',
  email: 'testEmail1@gmail.com',
  image: '/testImage1',
  //
  following: 1,
  followers: 1,
};

export const fakeSearchUsers = [
  {
    name: 'testName1',
    username: 'testUser1',
    email: 'testEmail1@gmail.com',
    image: '/testImage1',
    //
    following: 1,
    followers: null,
  },
  {
    name: 'testName2',
    username: 'testUser2',
    email: 'testEmail2@gmail.com',
    image: '/testImage2',
    //
    following: 2,
    followers: null,
  },
];
