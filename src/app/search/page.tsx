'use client';

import SearchInput from '@/components/SearchInput';
import UserCard from '@/components/UserCard';
import GridSpinner from '@/components/ui/GridSpinner';
import useDebounce from '@/hook/useDebounce';
import { DetailUser } from '@/model/user';
import useSWR from 'swr';

export default function SearchPage() {
  const [userQuery, onDebounce] = useDebounce();
  const { data: users, isLoading: loading } = useSWR<DetailUser[] | null>(
    `/api/users/${userQuery}`
  );

  return (
    <section className="flex flex-col justify-center items-center w-full max-w-screen-lg my-6">
      <SearchInput onChange={onDebounce} />
      {loading && (
        <div className="my-12">
          <GridSpinner />
        </div>
      )}
      <ul className="w-full p-5">
        {users &&
          users.length > 0 &&
          users.map((user) => <UserCard user={user} key={user.email} />)}
      </ul>
    </section>
  );
}
