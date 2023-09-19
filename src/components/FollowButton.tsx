'use client';
import { ProfileUser } from '@/model/user';
import Button from './ui/Button';
import useMe from '@/hooks/me';
import { useRouter } from 'next/navigation';

type Props = {
  user: ProfileUser;
};
export default function FollowButton({ user }: Props) {
  const { username } = user;
  const { user: loggedInUser, toggleFollow } = useMe();
  const router = useRouter();
  console.log(user);

  const showButton = loggedInUser && loggedInUser.username !== username;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === username);
  const text = following ? 'Unfollow' : 'Follow';

  const handleFollow = () => {
    toggleFollow(user.id, !following).then(() => router.refresh());
  };
  return (
    <>
      {showButton && (
        <Button text={text} onClick={handleFollow} red={text === 'Unfollow'} />
      )}
    </>
  );
}
