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
import { PostData } from './PostList';

type Props = {
  post: SimplePost;
  priority?: boolean;
  index: number;
  onLikedButtonClick: (
    index: number,
    updatedPost: SimplePost,
    postData: PostData
  ) => void;
};
export default function PostListCard({
  post,
  index,
  onLikedButtonClick,
  priority = false,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const { userImage, username, image, createdAt, likes, text } = post;
  const handleLikedButtonClick = (
    isLiked: boolean,
    loggedInUsername: string
  ) => {
    let requestMethod: 'add' | 'delete';
    const updatedPost: SimplePost = { ...post };
    updatedPost.likes = likes ? [...updatedPost.likes] : [];
    if (isLiked) {
      requestMethod = 'delete';
      const index = updatedPost.likes.indexOf(loggedInUsername);
      updatedPost.likes.splice(index, 1);
    } else {
      requestMethod = 'add';
      updatedPost.likes.push(loggedInUsername);
    }
    onLikedButtonClick(index, updatedPost, {
      username: loggedInUsername,
      method: requestMethod,
      type: 'like',
    });
  };
  return (
    <article className="rounded-lg shadow-md border border-gray-200">
      <PostUserAvatar userImage={userImage} username={username} />
      <Image
        className="w-full object-cover aspect-square"
        src={image}
        alt={`photo by ${username}`}
        width={500}
        height={500}
        priority={priority}
        onClick={() => setOpenModal(true)}
      />
      <ActionBar
        createdAt={createdAt}
        likes={likes}
        text={text}
        username={username}
        onLikedButtonClick={handleLikedButtonClick}
      />
      <CommentForm />
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
