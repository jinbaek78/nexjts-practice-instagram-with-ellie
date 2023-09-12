import { Comment, FullPost, SimplePost } from '@/model/post';
import useSWR, { useSWRConfig } from 'swr';
async function updateLike(id: string, like: boolean) {
  return fetch('/api/likes', {
    method: 'PUT',
    body: JSON.stringify({ id, like }),
  }).then((res) => res.json());
}

async function updateComment(postId: string, userId: string, comment: string) {
  return fetch('/api/comments', {
    method: 'PUT',
    body: JSON.stringify({ id: postId, userId, comment }),
  }).then((res) => res.json());
}

export default function usePosts() {
  const {
    data: posts,
    isLoading,
    error,
    mutate,
  } = useSWR<SimplePost[]>('/api/posts');
  const { mutate: globalMutate } = useSWRConfig();

  const setLike = (post: SimplePost, username: string, like: boolean) => {
    const newPost = {
      ...post,
      likes: like
        ? [...post.likes, username]
        : post.likes.filter((item) => item !== username),
    };
    const newPosts = posts?.map((p) => (p.id === post.id ? newPost : p));

    return mutate(updateLike(post.id, like), {
      optimisticData: newPosts,
      populateCache: false,
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const addComment = (postId: string, userId: string, comment: string) => {
    const newPosts = posts?.map((p) =>
      p.id === postId ? { ...p, comments: p.comments + 1 } : p
    );
    return mutate(updateComment(postId, userId, comment), {
      optimisticData: newPosts,
      populateCache: false,
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const updatePostModal = (post: FullPost, comment: Comment) => {
    const { id } = post;
    const newPost = { ...post, comments: [...post.comments, { ...comment }] };
    return globalMutate(`/api/posts/${id}`, newPost, { revalidate: false });
  };

  return { posts, isLoading, error, setLike, addComment, updatePostModal };
}
