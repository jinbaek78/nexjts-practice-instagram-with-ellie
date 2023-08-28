'use client';
import { useSession } from 'next-auth/react';
import Avatar from './ui/Avatar';

export default function SideBar() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex flex-col gap-10 text-lg">
      <div className="flex gap-6 items-center">
        <div className="flex">
          <Avatar image={user?.image} size="big" highLight={false} />
        </div>
        <div>
          <p className="font-bold">{user?.username}</p>
          <p>{user?.name}</p>
        </div>
      </div>
      <div className="text-zinc-500">
        <p>
          About ﹒Help﹒Press﹒API﹒Jobs﹒
          <br />
          Privacy ﹒ Terms ﹒ Location ﹒ <br />
          Launguage
        </p>
      </div>
      <div>
        <p>
          @Copyright INSTANTGRAM for
          <br /> METAL
        </p>
      </div>
    </div>
  );
}
