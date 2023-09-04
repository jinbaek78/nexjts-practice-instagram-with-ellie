import { ProfileUser, User } from '@/model/user';
import Avatar from './ui/Avatar';

const BUTTON_CLASS = 'ml-12 rounded-md p-2 px-12';

type Props = {
  user: ProfileUser;
  loggedInUser: User | undefined;
};
{
  /* <section className="w-full = flex justify-center items-center gap-12 text-xl p-12"> */
}

export default function UserInfo({ user, loggedInUser }: Props) {
  const { image, username } = user;
  return (
    <>
      <div className="">
        <Avatar image={user.image} highlight size="xLarge" />
      </div>
      <div>
        <div className="flex items-center text-2xl">
          <p className="text-3xl">{username}</p>
          {loggedInUser &&
            loggedInUser.username !== username &&
            user?.isfollowing && (
              <button
                className={`${BUTTON_CLASS} bg-red-500  hover:bg-red-500/90`}
              >
                <p className="text-white font-bold">Unfollow</p>
              </button>
            )}

          {loggedInUser &&
            loggedInUser.username !== username &&
            !user?.isfollowing && (
              <button
                className={`${BUTTON_CLASS} bg-sky-500  hover:bg-sky-500/90`}
              >
                <p className="text-white font-bold">Follow</p>
              </button>
            )}
        </div>
        <div className="flex my-4 gap-5 ">
          <div className="">
            <span className="font-bold">{user.posts} </span>
            <span> posts</span>
          </div>
          <div>
            <span className="font-bold">{user.followers}</span>
            <span> followers</span>
          </div>

          <div>
            <span className="font-bold">{user.following}</span>
            <span> following</span>
          </div>
        </div>
        <div>
          <p className="font-bold ml-1 text-2xl">{user.name}</p>
        </div>
      </div>
    </>
  );
}
