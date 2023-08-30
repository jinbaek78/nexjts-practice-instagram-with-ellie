import { DetailUser } from '@/model/user';

const simpleUser1 = { username: 'testUser1', image: '/test1' };
const simpleUser2 = { username: 'testUser2', image: '/test2' };

export const fakeDetailUser: DetailUser = {
  // user
  name: 'testName1',
  username: 'testUser1',
  email: 'testEmail@gmail.com',
  image: '/testImage',
  //
  following: [simpleUser1, simpleUser2],
  followers: [],
  bookmarks: [],
};
