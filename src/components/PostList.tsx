'use client';
import { SimplePost } from '@/model/post';
import useSWR, { useSWRConfig } from 'swr';
import PostListCard from './PostListCard';
import GridSpinner from './ui/GridSpinner';

export type PostData = {
  type: 'like' | 'bookmark' | 'comment';
  method: 'add' | 'delete';
  username: string;
};

export default function PostList() {
  const {
    data: posts,
    isLoading: loading,
    mutate,
  } = useSWR<SimplePost[]>('/api/posts');
  console.log('posts: ', posts);

  const handleToggleLikedButton = (
    index: number,
    updatedPost: SimplePost,
    postData: PostData
  ) => {
    if (posts) {
      const { method, type, username } = postData;
      const postId = posts[index].id;
      const updatedPosts = [...posts];
      updatedPosts[index] = { ...updatedPost };
      mutate(updatedPosts, { revalidate: false });
      const data: PostData = {
        type, //"likes" | "bookmark" | "comments"
        method, // 'delete'
        username,
      };
      console.log('tobefetched data: ', data);

      fetch(`/api/posts/${postId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((_) => mutate());
    }
  };
  return (
    <section>
      {loading && (
        <div className="text-center mt-32">
          <GridSpinner color="red" />
        </div>
      )}
      {posts && (
        <ul>
          {posts.map((post, index) => (
            <li key={post.id} className="mb-4">
              <PostListCard
                post={post}
                priority={index < 2}
                index={index}
                onLikedButtonClick={handleToggleLikedButton}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
