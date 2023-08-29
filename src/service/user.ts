import { East_Sea_Dokdo } from 'next/font/google';
import { client } from './sanity';
import { UserInDB } from '@/model/user';

type OauthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  image?: string | null;
};

export async function addUser({ id, username, email, name, image }: OauthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    username,
    email,
    name,
    image,
    bookmarks: [],
  });
}

export async function getFollowingUsers(userEmail: string) {
  if (!userEmail) {
    return;
  }
  console.time('getAllusers');
  const myInfo: UserInDB = (
    await client.fetch(`*[_type == "user" && email == '${userEmail}']`)
  )[0];
  const userIdQueries: string[] = [];
  myInfo?.following?.forEach((user) =>
    userIdQueries.push(`_id == '${user._ref}'`)
  );
  const users = await client.fetch(
    `*[_type == "user" && ( ${userIdQueries.join(' || ')} )]`
  );
  // console.log('found User: ', users);
  console.timeEnd('getAllusers');
  return users;
}
