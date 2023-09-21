import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Avatar from '@/components/ui/Avatar';
import NewPostForm from '@/components/NewPostForm';

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <section className="w-full h-full max-w-4xl flex flex-col justify-center items-center gap-12 p-5">
      <div className="flex items-center">
        <Avatar image={user?.image} size="large" />
        <p className="font-bold ml-2">{user?.username}</p>
      </div>
      <div className="w-full h-full flex-grow">
        <NewPostForm />
      </div>
    </section>
  );
}
