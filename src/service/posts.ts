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
  // "commentsDetail": comments[]{author->{image, username}, comment},
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

export async function getPostCommentsById(postId: string) {
  return client.fetch(
    `
    *[_type == "post" && _id == "${postId}"][0]{
      comments[]{ 
        comment, 
        "username":author->username,
        "image":author->image
      }
    }.comments
    `
  );
}
