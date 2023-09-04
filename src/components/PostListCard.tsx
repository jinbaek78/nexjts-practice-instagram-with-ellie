import { SimplePost } from '@/model/post';
import Avatar from './ui/Avatar';
import Image from 'next/image';
import CommentForm from './CommentForm';
import ActionBar from './ActionBar';
import { useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import PostUserAvatar from './PostUserAvatar';

type Props = {
  post: SimplePost;
  priority?: boolean;
  onlyImage?: boolean;
  onClick?: (callback: () => void) => void;
};
export default function PostListCard({
  post,
  priority = false,
  onlyImage = false,
  onClick,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const { userImage, username, image, createdAt, likes, text } = post;
  const handlePostImageClick = () => {
    onClick && onClick(() => setOpenModal(true));
  };
  return (
    <article className="rounded-lg shadow-md border border-gray-200">
      {!onlyImage && (
        <PostUserAvatar userImage={userImage} username={username} />
      )}
      <Image
        className="w-full object-cover aspect-square"
        src={image}
        alt={`photo by ${username}`}
        width={500}
        height={500}
        priority={priority}
        onClick={handlePostImageClick}
      />

      {!onlyImage && (
        <ActionBar
          createdAt={createdAt}
          likes={likes}
          text={text}
          username={username}
        />
      )}

      {!onlyImage && <CommentForm />}
      {/* <CommentForm /> */}

      {openModal && (
        <ModalPortal>
          <PostModal onClose={() => setOpenModal(false)}>
            <PostDetail post={post} />
          </PostModal>
        </ModalPortal>
      )}
    </article>
  );
}
