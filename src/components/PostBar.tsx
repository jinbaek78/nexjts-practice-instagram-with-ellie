'use client';

import { Post } from '@/model/post';
import dynamic from 'next/dynamic';
// import { GridLoader } from 'react-spinners';
import useSWR from 'swr';
import PostFormCard from './PostFormCard';

const GridLoader = dynamic(() => import('react-spinners/GridLoader'), {
  ssr: false,
});

export default function PostBar() {
  const {
    data: posts,
    isLoading: loading,
    error,
  } = useSWR<Post[]>('/api/posts');
  console.log('PostBar: posts: ', posts);
  return (
    <section className="flex justify-center items-center">
      {loading && <GridLoader color="red" />}
      {posts && posts?.length > 0 && (
        <ul>
          {posts.map((post) => (
            <PostFormCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}
