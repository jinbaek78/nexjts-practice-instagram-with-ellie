import { SimplePost } from '@/model/post';
import Image from 'next/image';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

type Props = {
  post: SimplePost;
  priority: boolean;
  onGridLikeClick?: (
    post: SimplePost,
    username: string,
    like: boolean
  ) => Promise<any>;
};
export default function PostGridCard({
  post,
  priority = false,
  onGridLikeClick,
}: Props) {
  const { image, username } = post;
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenPost = () => {
    if (!session?.user) {
      return signIn();
    }

    setOpenModal(true);
  };

  return (
    <div className=" relative w-full aspect-square">
      <Image
        className="object-cover"
        src={image}
        alt={`photo by ${username}`}
        sizes="650px"
        fill
        // objectFit="contain"
        priority={priority}
        onClick={handleOpenPost}
      />
      {openModal && (
        <ModalPortal>
          <PostModal onClose={() => setOpenModal(false)}>
            <PostDetail post={post} onGridLikeClick={onGridLikeClick} />
          </PostModal>
        </ModalPortal>
      )}
    </div>
  );
}
