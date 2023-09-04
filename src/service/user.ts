import { ProfileUser } from '@/model/user';
import { client } from './sanity';

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

export async function getUserByUsername(username: string) {
  console.log('getUserByUsername called with: ', username);
  return client.fetch(
    `
    *[_type == "user" && username == "${username}"][0]{
      ...,
      "id": _id,
      following[]->{username, image},
      followers[]->{username, image},
      "bookmarks":bookmarks[]->_id
    }
    `
  );
}

export async function getUserDetailByUsername(
  username: string,
  loggedInUsername?: string
) {
  console.log(
    'getUserDetailByUsername called with: ',
    username,
    ' loggedInUsername :',
    loggedInUsername
  );
  const query = loggedInUsername
    ? `*[_type == 'user' && username == "${loggedInUsername}"].following[]->.username`
    : `[]`;

  return client
    .fetch(
      `
    *[_type == "user" && username == "${username}"][0]{
      ...,
      "id": _id,
      "following": count(following),
      "followers": count(followers),
      "posts": count(*[_type == 'post' && author->username == "${username}"]),
      "isfollowing": username in ${query}
    }
    `
    )
    .then((user) => ({
      ...user,
      following: user.following ?? 0,
      followers: user.followers ?? 0,
    }));
}

export async function searchUsers(keyword?: string) {
  const query = keyword
    ? `&& (name match "${keyword}" || username match "${keyword}")`
    : '';
  return client
    .fetch(
      `*[_type == "user" ${query}]{
      ...,
      "following": count(following),
      "followers": count(followers)
    }`
    )
    .then((users) =>
      users.map((user: ProfileUser) => ({
        ...user,
        following: user.following ?? 0,
        followers: user.followers ?? 0,
      }))
    );
}
