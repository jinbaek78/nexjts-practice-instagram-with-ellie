import { useSession } from 'next-auth/react';
import { BookMarkIcon, HeartFillIcon, HeartIcon } from './ui/icons';
import { parseDate } from '@/util/date';

type Props = {
  likes: string[];
  username: string;
  createdAt: string;
  text?: string;
  onLikedButtonClick?: (isLiked: boolean, loggedInUsername: string) => void;
};
export default function ActionBar({
  likes,
  username,
  text,
  createdAt,
  onLikedButtonClick,
}: Props) {
  const { data: session } = useSession();
  const loggedInUsername = session?.user?.username || '';
  const isLiked = likes?.includes(loggedInUsername) ?? false;
  const handleLikedButtonClick = () => {
    onLikedButtonClick && onLikedButtonClick(isLiked, loggedInUsername);
  };
  return (
    <>
      <div className="flex justify-between my-2 px-4">
        <div onClick={handleLikedButtonClick}>
          {isLiked ? <HeartFillIcon /> : <HeartIcon />}
        </div>
        <BookMarkIcon />
      </div>
      <div className="px-4 py-1">
        <p className="text-sm font-bold mb-2">
          {`${likes?.length ?? 0}`} {likes?.length > 1 ? 'likes' : 'like'}
        </p>
        {text && (
          <p>
            <span className="font-bold mr-1">{username}</span>
            {text}
          </p>
        )}
        <p className="text-xs text-neutral-500 uppercase my-2">
          {parseDate(createdAt)}
        </p>
      </div>
    </>
  );
}
