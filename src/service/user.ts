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

export async function getUserByUsernameOrName(usernameOrName: string) {
  return client.fetch(
    `
    *[_type == "user" && username == "${usernameOrName}"][0]{
      ...,
      "id": _id,
      following[]->{username, image},
      followers[]->{username, image},
      "bookmarks":bookmarks[]->_id
    }
    `
  );
}

export async function getAllUsers() {
  return client.fetch(
    `
    *[_type == "user"]{
      ...,
      "id": _id,
      following[]->{username, image},
      followers[]->{username, image},
      "bookmarks":bookmarks[]->_id
    }
    `
  );
}
