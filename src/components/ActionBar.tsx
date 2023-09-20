import {
  BookMarkIcon,
  BookmarkFillIcon,
  HeartFillIcon,
  HeartIcon,
} from './ui/icons';
import { parseDate } from '@/util/date';
import ToggleButton from './ui/ToggleButton';
import { Comment, SimplePost } from '@/model/post';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';
import CommentForm from './CommentForm';

type Props = {
  post: SimplePost;
  onComment: (comment: Comment) => void;
  children?: React.ReactNode;
  onGridLikeClick?: (
    post: SimplePost,
    username: string,
    like: boolean
  ) => Promise<any>;
};
export default function ActionBar({
  post,
  children,
  onComment,
  onGridLikeClick,
}: Props) {
  const { id, likes, createdAt } = post;
  const { user, setBookmark } = useMe();
  const liked = user ? likes.includes(user.username) : false;
  const bookmarked = user?.bookmarks.includes(id) ?? false;
  const { setLike } = usePosts();
  const requestSetLike = onGridLikeClick ? onGridLikeClick : setLike;
  const handleLike = (like: boolean) => {
    user && requestSetLike(post, user.username, like);
  };

  const handleBookmark = (bookmark: boolean) => {
    user && setBookmark(id, bookmark);
  };

  const handleComment = (comment: string) => {
    user && onComment({ comment, username: user.username, image: user.image });
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
        {children}
        <p className="text-xs text-neutral-500 uppercase my-2">
          {parseDate(createdAt)}
        </p>
      </div>
      <CommentForm onPostComment={handleComment} />
    </>
  );
}
