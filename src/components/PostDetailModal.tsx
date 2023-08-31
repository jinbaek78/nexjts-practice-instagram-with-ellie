import { Comment, SimplePost } from '@/model/post';
import Image from 'next/image';
import Avatar from './ui/Avatar';
import ActionBar from './ActionBar';
import CommentForm from './CommentForm';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  post: SimplePost;
};
const PostDetailModal = forwardRef(function PostDetailModal(
  { post }: Props,
  ref: React.Ref<HTMLDialogElement> | null
) {
  const { userImage, username, image, createdAt, likes, text, id } = post;
  const { data: comments, isLoading } = useSWR(`/api/comments/${id}`);
  // console.log('PostDetailModal: post: ', post);
  console.log('PostDetailModal: data:', comments);
  return createPortal(
    <dialog
      ref={ref}
      className="backdrop:bg-black backdrop:opacity-60 flex outline-none w-full max-w-screen-xl"
    >
      <div className="basis-8/12 ">
        <Image
          className="w-full object-cover aspect-square "
          src={image}
          alt={`photo by ${username}`}
          width={500}
          height={500}
        />
      </div>
      <div className="basis-4/12 w-full flex flex-col">
        <div className="flex items-center p-2  border-b border-neutral-300">
          <Avatar image={userImage} highlight size="medium" />
          <span className="text-gray-900 font-bold ml-2">{username}</span>
        </div>

        <ul className="flex-grow p-4 ">
          {comments &&
            comments.map(({ comment, image, username }: Comment) => (
              <li key={uuidv4()} className="flex gap-1 items-start mb-2">
                <Avatar image={image} highlight size="small" />
                <div className="ml-2">
                  <span className="font-bold">{username}</span>
                  <span className="ml-2">{comment}</span>
                </div>
              </li>
            ))}
        </ul>

        <ActionBar
          createdAt={createdAt}
          likes={likes}
          text={text}
          username={username}
          isDialog
        />
        <CommentForm />
      </div>
    </dialog>,
    document.body
  );
});

export default PostDetailModal;
