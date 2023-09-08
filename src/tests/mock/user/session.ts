import { Session } from 'next-auth';

export const fakeSession: Session = {
  expires: '2023-09-27T08:36:38.457Z',
  user: {
    email: 'test@gmail.com',
    image: '/test@',
    name: 'testUserName',
    username: 'test',
    id: 'testUserId',
  },
};
