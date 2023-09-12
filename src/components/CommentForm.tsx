import { Comment, FullPost, SimplePost } from '@/model/post';
import SmileIcon from './ui/icons/SmileIcon';
import useMe from '@/hooks/me';
import usePosts from '@/hooks/posts';
import { ChangeEvent, useState } from 'react';

type Props = {
  post: SimplePost;
  // post: SimplePost | FullPost;
  comments?: Comment[];
};
export default function CommentForm({ post, comments = undefined }: Props) {
  const [comment, setComment] = useState('');
  const { user } = useMe();
  const { addComment, updatePostModal } = usePosts();
  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setComment(target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    user && addComment(post?.id, user.id, comment);
    user &&
      comments &&
      updatePostModal(
        { ...post, comments },
        {
          comment,
          image: user.image || '',
          username: user.username,
        }
      );

    setComment('');
  };

  return (
    <form
      className="flex items-center px-3 border-t border-neutral-300"
      onSubmit={handleSubmit}
    >
      <SmileIcon />
      <input
        className="w-full ml-2 border-none outline-none p-3"
        type="text"
        placeholder="Add a comment..."
        onChange={handleChange}
        value={comment}
      />
      <button
        disabled={comment === ''}
        className="font-bold text-sky-500 ml-2 disabled:font-normal"
      >
        Post
      </button>
    </form>
  );
}
