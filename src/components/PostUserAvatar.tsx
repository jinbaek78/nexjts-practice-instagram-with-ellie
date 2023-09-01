import Avatar from './ui/Avatar';

type Props = {
  userImage: string;
  username: string;
};
export default function PostUserAvatar({ userImage, username }: Props) {
  return (
    <div className="flex items-center p-2">
      <Avatar image={userImage} highlight size="medium" />
      <span className="text-gray-900 font-bold ml-2">{username}</span>
    </div>
  );
}
