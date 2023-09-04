'use client';
import { useState } from 'react';
import useSWR from 'swr';
import UserPosts from './UserPosts';
import UserSavedPosts from './UserSavedPosts';
import UserLikedPosts from './UserLikedPosts';
import { ProfileUser } from '@/model/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserInfo from './UserInfo';
import PostOptionButtons from './PostOptionButtons';
import GridSpinner from './ui/GridSpinner';

export type Selected = 'posts' | 'saved' | 'liked';

type Props = {
  username: string;
};
export default function UserPage({ username }: Props) {
  const [selected, setSelected] = useState<Selected>('posts');
  const { data: user, isLoading: loading } = useSWR<ProfileUser>(
    `/api/user/${username}`
  );
  const userId = user?.id;
  const { data: session } = useSession();
  const loggedInUser = session?.user;
  const router = useRouter();
  console.log('UserPage: session:  ', session);
  console.log('user: ;', user);
  console.log('selected: ', selected);

  const handleClick = (event: React.MouseEvent) => {
    const button = event.target as HTMLButtonElement;
    setSelected(button.name as Selected);
  };

  const handlePostImageClick = (callback: () => void) => {
    if (!session) {
      console.log('there is no session yet!');
      router.push('/auth/signin');
      return;
    }

    callback && callback();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center my-3">
      <section className="relative w-full min-h-[270px] flex justify-center items-center gap-12 text-xl p-12">
        {loading && (
          <div className="absolute top-1/3">
            <GridSpinner />
          </div>
        )}
        {user && <UserInfo user={user} loggedInUser={loggedInUser} />}
      </section>
      <section className="w-full max-w-screen-xl flex flex-col justify-center items-center border-t border-neutral-300 my-3">
        <PostOptionButtons selected={selected} onClick={handleClick} />
        {selected === 'posts' && (
          <UserPosts username={username} onClick={handlePostImageClick} />
        )}
        {selected === 'saved' && (
          <UserSavedPosts onClick={handlePostImageClick} username={username} />
        )}
        {selected === 'liked' && (
          <UserLikedPosts onClick={handlePostImageClick} userId={userId} />
        )}
      </section>
    </div>
  );
}
