import useSWR from 'swr';
import PostListCard from './PostListCard';
import { SimplePost } from '@/model/post';
import GridSpinner from './ui/GridSpinner';

type Props = {
  userId: string | undefined;
  onClick: (callback: () => void) => void;
};
export default function UserLikedPosts({ userId, onClick }: Props) {
  const { data: posts, isLoading: loading } = useSWR<SimplePost[]>(
    `/api/posts/user/liked/${userId}`
  );
  return (
    <ul className="relative grid grid-cols-3 gap-3 px-8 py-5">
      {loading && (
        <div className="absolute top-12">
          <GridSpinner />
        </div>
      )}
      {posts &&
        posts.map((post, index) => (
          <li key={index}>
            <PostListCard post={post} onlyImage onClick={onClick} />
          </li>
        ))}
    </ul>
  );
}
