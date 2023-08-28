import { createClient } from '@sanity/client';
import { User } from 'next-auth';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_SECRET_TOKEN || '',
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-08-25',
});

export async function createIfNotExists(user: User) {
  console.log('createIfNotExists: called with: ', user);
  const { id, image, email, name } = user;
  const doc = {
    _type: 'user',
    _id: id,
    username: email?.split('@')?.[0] || '',
    name,
    email,
    image,
    following: [],
    followers: [],
    bookmarks: [],
  };
  console.log('createIfNotExists: doc: ', doc);

  let result;
  try {
    // result = await client.create(doc);
    result = await client.createIfNotExists(doc);
  } catch (error) {
    console.error(error);
  }

  console.log('createIfNotExists: result :', result);
}

export async function getAllUsers() {
  const users = await client.fetch('*[_type == "user"]');
  console.log('users: ', users);
}
