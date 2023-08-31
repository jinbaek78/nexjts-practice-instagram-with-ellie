import { BookmarkIcon, HeartIcon } from './ui/icons';
import { parseDate } from '@/util/date';

type Props = {
  likes: string[];
  username: string;
  text: string;
  createdAt: string;
  isDialog?: boolean;
};
export default function ActionBar({
  likes,
  username,
  text,
  createdAt,
  isDialog = false,
}: Props) {
  return (
    <>
      <div className="flex justify-between my-2 px-4">
        <HeartIcon />
        <BookmarkIcon />
      </div>
      <div className="px-4 py-1">
        <p className="text-sm font-bold mb-2">
          {`${likes?.length ?? 0}`} {likes?.length > 1 ? 'likes' : 'like'}
        </p>
        {!isDialog && (
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
