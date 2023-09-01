import { DetailUser } from '@/model/user';
import Avatar from './ui/Avatar';
import Link from 'next/link';

type Props = {
  user: DetailUser;
};
export default function UserCard({ user }: Props) {
  const { image, username, name, followers, following } = user;
  return (
    <li className="w-full border border-neutral-300 bg-white mb-2 p-6">
      <Link href={`/user/${username}`} className="flex ">
        <Avatar image={image} size="large" />
        <div className="ml-3 text-xl">
          <p className="font-bold leading-6">{username}</p>
          <p className="text-neutral-500 leading-6">{name}</p>
          <p className="text-neutral-500">
            {followers?.length ?? 0} followers {following?.length ?? 0}{' '}
            following
          </p>
        </div>
      </Link>
    </li>
  );
}
