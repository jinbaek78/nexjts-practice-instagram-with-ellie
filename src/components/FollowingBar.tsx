'use client';
import { User, UserInDB } from '@/model/user';
import { getFollowingUsers } from '@/service/user';
import useSWR from 'swr';
import Avatar from './ui/Avatar';
import { PropagateLoader } from 'react-spinners';
import FollowingCarousel from '@/components/FollowingCarousel';

export default function FollowingBar() {
  // const { isLoading, data: following } = useSWR('/api/following', () =>
  //   fetch('/api/following').then((res) => res.json())
  // );
  const { isLoading, data: following } = useSWR('/api/following');
  console.log('FollowingBar followingUser: ', following);

  return (
    <ul className="shadow-lg p-2 static pl-8 w-[610px] h-[120px]">
      {isLoading && (
        <PropagateLoader
          color="red"
          className="w-full absolute left-1/2  top-1/3 z-10  "
        />
      )}
      <FollowingCarousel following={following} />
    </ul>
  );
}
