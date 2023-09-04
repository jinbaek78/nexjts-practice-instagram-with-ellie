import { SimplePost } from '@/model/post';
import { client, urlFor } from './sanity';

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

export async function getFollowingPostsOf(username: string) {
  return client
    .fetch(
      `*[_type == "post" && author->username == "${username}"
    || author._ref in *[_type == "user" && username == "${username}"].following[]._ref]
    | order(_createdAt desc){${simplePostProjection}}
    `
    )
    .then((posts) => {
      return posts.map((post: SimplePost) => ({
        ...post,
        image: urlFor(post.image),
      }));
    });
}

export async function getPost(id: string) {
  return client
    .fetch(
      `*[_type == "post" && _id == "${id}"][0]{
      ...,
      "username": author->username,
      "userImage": author->image,
      "image": photo,
      "likes": likes[]->username,
      comments[]{comment, "username": author->username, "image": author->image},
      "id":_id,
      "createdAt":_createdAt
    }
    `
    )
    .then((post) => ({ ...post, image: urlFor(post.image) }));
}

export async function getUserPosts(username: string) {
  return client
    .fetch(
      `*[_type == "post" && author->username == "${username}" ]{${simplePostProjection}}
      `
    )
    .then((posts) => {
      if (posts.length === 1 && posts[0] === null) {
        return [];
      }
      return posts.map((post: SimplePost) => ({
        ...post,
        image: urlFor(post.image),
      }));
    });
}

export async function getUserSavedPosts(username: string) {
  return client
    .fetch(
      `*[_type == "user" && username == "${username}"].bookmarks[]->{${simplePostProjection}}
      `
    )
    .then((posts) => {
      if (posts.length === 1 && posts[0] === null) {
        return [];
      }
      return posts.map((post: SimplePost) => ({
        ...post,
        image: urlFor(post.image),
      }));
    });
}

export async function getUserLikedPosts(userId: string) {
  return client
    .fetch(
      `*[_type == "post" && "${userId}" in likes[]->._id ]{${simplePostProjection}}`
    )
    .then((posts) => {
      console.log('getuserLiekdPosts: posts: ', posts);
      if (posts.length === 1 && posts[0] === null) {
        return [];
      }
      return posts.map((post: SimplePost) => ({
        ...post,
        image: urlFor(post.image),
      }));
    });
}
