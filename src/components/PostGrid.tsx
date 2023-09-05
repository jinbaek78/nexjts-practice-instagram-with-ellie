import useSWR from 'swr';
import GridSpinner from './ui/GridSpinner';
import { SimplePost } from '@/model/post';
import PostGridCard from './PostGridCard';

type Props = {
  username: string;
  query: string;
};
export default function PostGrid({ username, query }: Props) {
  const { data: posts, isLoading: loading } = useSWR<SimplePost[]>(
    `/api/users/${username}/${query}`
  );

  return (
    <div className="w-full text-center">
      {loading && <GridSpinner />}
      <ul className="grid grid-cols-3 gap-4 py-4 px-8">
        {posts &&
          posts.map((post, index) => (
            <li key={post.id + index} className="w-full">
              <PostGridCard post={post} priority={index < 6} />
            </li>
          ))}
      </ul>
    </div>
  );
}
