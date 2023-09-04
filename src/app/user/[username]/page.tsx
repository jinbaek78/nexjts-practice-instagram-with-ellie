import UserPage from '@/components/UserPage';

type Props = {
  params: {
    username: string;
  };
};
export default function page({ params: { username } }: Props) {
  return <UserPage username={username} />;
}
