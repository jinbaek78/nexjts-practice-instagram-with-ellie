import { User } from '@/model/user';
import Avatar from './ui/Avatar';

type Props = {
  user: User;
};

export default function SideBar({
  user: { email, name, username, image },
}: Props) {
  return (
    <>
      <div className="flex items-center">
        {image && <Avatar image={image} />}
        <div className="ml-4">
          <p className="font-bold">{username}</p>
          <p className="text-lg text-neutral-500 leading-4">{name}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-500 mt-8">
        About ﹒ Help ﹒ Press ﹒ API ﹒ Jobs ﹒ Privacy ﹒ Terms ﹒ Location﹒
      </p>
      <p className="font-bold text-sm mt-8 text-neutral-500">
        Copyright INSTANTGRAM from METAL{' '}
      </p>
    </>
  );
}
