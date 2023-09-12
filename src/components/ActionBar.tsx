import {
  BookMarkIcon,
  BookmarkFillIcon,
  HeartFillIcon,
  HeartIcon,
} from './ui/icons';
import { parseDate } from '@/util/date';
import ToggleButton from './ui/ToggleButton';
import { SimplePost } from '@/model/post';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';

type Props = {
  post: SimplePost;
  onCommentClick?: () => void;
  modal?: boolean;
};
export default function ActionBar({
  post,
  onCommentClick,
  modal = false,
}: Props) {
  const { id, likes, username, text, createdAt } = post;
  const { user, setBookmark } = useMe();
  const liked = user ? likes.includes(user.username) : false;
  const bookmarked = user?.bookmarks.includes(id) ?? false;
  const { setLike } = usePosts();
  const handleLike = (like: boolean) => {
    user && setLike(post, user.username, like);
  };

  const handleBookmark = (bookmark: boolean) => {
    user && setBookmark(id, bookmark);
  };

  return (
    <>
      <div className="flex justify-between my-2 px-4">
        <ToggleButton
          toggled={liked}
          onToggle={handleLike}
          onIcon={<HeartFillIcon />}
          offIcon={<HeartIcon />}
        />
        <ToggleButton
          toggled={bookmarked}
          onToggle={handleBookmark}
          onIcon={<BookmarkFillIcon />}
          offIcon={<BookMarkIcon />}
        />
      </div>
      <div className="px-4 py-1">
        <p className="text-sm font-bold mb-2">
          {`${likes?.length ?? 0}`} {likes?.length > 1 ? 'likes' : 'like'}
        </p>
        {text && !modal && (
          <>
            <p>
              <span className="font-bold mr-1">{username}</span>
              {text}
            </p>
            {post.comments > 1 && (
              <p className="font-bold mr-1 text-sky-600 mt-3 mb-5 text-xl">
                <span
                  onClick={() => onCommentClick && onCommentClick()}
                  className="cursor-pointer"
                >{`View all ${post.comments} comments`}</span>
              </p>
            )}
          </>
        )}
        <p className="text-xs text-neutral-500 uppercase my-2">
          {parseDate(createdAt)}
        </p>
      </div>
    </>
  );
}
