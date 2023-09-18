'use client';
import { ProfileUser } from '@/model/user';
import Button from './ui/Button';
import useMe from '@/hooks/me';
import { PulseLoader } from 'react-spinners';

type Props = {
  user: ProfileUser;
  isUpdating: boolean;
  onClick: (id: string, type: string, username: string) => void;
};
export default function FollowButton({
  user: { username },
  isUpdating,
  onClick,
}: Props) {
  const { user: loggedInUser } = useMe();
  console.log(isUpdating);

  const showButton = loggedInUser && loggedInUser.username !== username;
  const following =
    loggedInUser &&
    loggedInUser.following.find((item) => item.username === username);
  const text = following ? 'Unfollow' : 'Follow';

  const handleClick = () => {
    if (!loggedInUser) return;
    return onClick && onClick(loggedInUser.id, text, username);
  };
  return (
    <>
      {showButton && (
        <div className="relative">
          <Button
            text={text}
            isLoading={isUpdating}
            onClick={handleClick}
            red={text === 'Unfollow'}
          />
          {isUpdating && (
            <PulseLoader
              className="absolute top-1/3 left-1/3 -translate-y-1 "
              size={10}
              color="black"
              speedMultiplier={0.7}
            />
          )}
        </div>
      )}
    </>
  );
}
