import { DetailUser, ProfileUser } from '@/model/user';

const simpleUser1 = { username: 'testUser1', image: '/test1' };
const simpleUser2 = { username: 'testUser2', image: '/test2' };

export const fakeDetailUser: DetailUser = {
  name: 'testName1',
  username: 'testUser1',
  email: 'testEmail@gmail.com',
  image: '/testImage',
  //
  following: [simpleUser1, simpleUser2],
  followers: [],
  bookmarks: [],
};

export const fakeDetailUsers: DetailUser[] = [
  {
    name: 'testName1',
    username: 'testUser1',
    email: 'testEmail@gmail.com',
    image: '/testImage',
    //
    following: [simpleUser1],
    followers: [],
    bookmarks: [],
  },
  {
    name: 'testName2',
    username: 'testUser2',
    email: 'testEmail2@gmail.com',
    image: '/testImage2',
    //
    following: [simpleUser1, simpleUser2],
    followers: [],
    bookmarks: [],
  },
];

export const fakeProfileUser: ProfileUser = {
  name: 'testName1',
  username: 'testUser1',
  email: 'testEmail1@gmail.com',
  image: '/testImage1',
  //
  following: 1,
  followers: 1,
};

export const fakeProfileUsers = [
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
