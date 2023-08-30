import { Post } from '@/model/post';
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

export async function getFollowingUserIdsByUsername(username: string) {
  console.log('getFollowingUserIdsByUsername called with username:', username);
  return client.fetch(
    `
  *[_type == "user" && username == "${username}"][0]{
    "followingUserIds": following[]._ref + [_id],
  }
  `
  );
}

export async function getFollowingPostsByUsername(username: string) {
  const userIds = (await getFollowingUserIdsByUsername(username))
    .followingUserIds;

  let userIdsQuery = [];
  for (let i = 0; i < userIds?.length; i++) {
    userIdsQuery.push(`"${userIds?.[i]}"`);
  }

  const posts = await client.fetch(
    `
    *[_type == "post" && author._ref in [ ${userIdsQuery.join(',')} ] ]{
      comments,
      likes[]->{_id, username},
      "id": _id,
      "createdAt": _createdAt,
      "author": author->{image, username },
      "postImageUrl": photo.asset->url,
      "commentAuthors": comments[].author->{image, username}
    } | order(createdAt desc)
    `
  );
  const organizedPosts = organizePost(posts);
  return organizedPosts;
}

function organizePost(posts: any[]) {
  const organizedPosts: Post[] = [];
  for (let i = 0; i < posts?.length; i++) {
    const { author, comments, createdAt, id, likes, postImageUrl } = posts[i];
    const addedComments = [...posts[i].comments];
    const organizedComments = [];

    for (let j = 0; j < addedComments?.length; j++) {
      organizedComments.push({
        ...addedComments[j],
        author: posts[i].commentAuthors[j],
      });
    }

    organizedPosts.push({
      // ...posts[i],
      author,
      createdAt,
      id,
      likes,
      postImageUrl,
      comments: organizedComments,
    });
  }
  return organizedPosts;
}
