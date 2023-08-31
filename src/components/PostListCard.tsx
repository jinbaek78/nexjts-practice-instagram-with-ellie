import { SimplePost } from '@/model/post';
import Avatar from './ui/Avatar';
import Image from 'next/image';
import CommentForm from './CommentForm';
import ActionBar from './ActionBar';
import { useRef, useState } from 'react';
import PostDetailModal from './PostDetailModal';

type Props = {
  post: SimplePost;
  priority?: boolean;
};
export default function PostListCard({ post, priority = false }: Props) {
  const dialogRef = useRef(null);
  const { userImage, username, image, createdAt, likes, text } = post;
  const handleClick = (event: React.MouseEvent) => {
    if (!dialogRef?.current) {
      return;
    }

    const targetTagName = (event.target as HTMLElement).tagName;
    const dialog = dialogRef.current as HTMLDialogElement;
    if (targetTagName === 'DIALOG') {
      dialog.close();
      return;
    }
    dialog.showModal();
  };
  return (
    <article
      className="rounded-lg shadow-md border border-gray-200"
      onClick={handleClick}
    >
      <div className="flex items-center p-2">
        <Avatar image={userImage} highlight size="medium" />
        <span className="text-gray-900 font-bold ml-2">{username}</span>
      </div>
      <Image
        className="w-full object-cover aspect-square"
        src={image}
        alt={`photo by ${username}`}
        width={500}
        height={500}
        priority={priority}
      />
      <ActionBar
        createdAt={createdAt}
        likes={likes}
        text={text}
        username={username}
      />
      <CommentForm />
      <PostDetailModal post={post} ref={dialogRef} />
    </article>
  );
}

{
  /* {showModal &&
        createPortal(
          <dialog ref={dialogRef} className="">
            <Image
              className="w-full object-cover aspect-square "
              src={image}
              alt={`photo by ${username}`}
              width={500}
              height={500}
              priority={priority}
            />
          </dialog>,
          document.body
        )} */
}

{
  /* <dialog
ref={dialogRef}
className="backdrop:bg-gray-90 flex outline-none w-full max-w-screen-xl"
>
<div className="basis-8/12 ">
  <Image
    className="w-full object-cover aspect-square "
    src={image}
    alt={`photo by ${username}`}
    width={500}
    height={500}
    priority={priority}
  />
</div>
<div className="basis-4/12 w-full flex flex-col">
  <div className="flex items-center p-2  border-b border-neutral-300">
    <Avatar image={userImage} highlight size="medium" />
    <span className="text-gray-900 font-bold ml-2">{username}</span>
  </div>

  <div className="flex-grow">comments line</div>

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
document.body */
}
