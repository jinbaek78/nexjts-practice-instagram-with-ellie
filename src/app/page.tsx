import FollowingBar from '@/components/FollowingBar';
import PostList from '@/components/PostList';
import SideBar from '@/components/SideBar';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex justify-between p-3 px-8 text-4xl">
      <section>
        <FollowingBar />
        <PostList />
      </section>
      <section>
        <SideBar />
      </section>
    </div>
  );
}
