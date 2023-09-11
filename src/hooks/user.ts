import { HomeUser } from '@/model/user';
import useSWR, { useSWRConfig } from 'swr';

async function updateBookmarks(id: string, bookmark: boolean) {
  return fetch('/api/bookmarks', {
    method: 'PUT',
    body: JSON.stringify({ id, bookmark }),
  }).then((res) => res.json());
}

export default function useUser() {
  const { data: user, isLoading, error, mutate } = useSWR<HomeUser>('/api/me');
  const isBookmarked = (postId: string) => {
    return user ? user.bookmarks.includes(postId) : false;
  };
  const setBookmark = (postId: string, bookmark: boolean) => {
    if (!user) {
      return;
    }

    const newUser = {
      ...user,
      bookmarks: bookmark
        ? [...user?.bookmarks, postId]
        : user?.bookmarks.filter((id) => id !== postId),
    };

    return mutate(updateBookmarks(postId, bookmark), {
      optimisticData: newUser,
      populateCache: false,
      revalidate: false,
      rollbackOnError: true,
    }).then((res) => {
      console.log('mutate is done with result: ', res);
    });
  };

  return { user, isLoading, error, setBookmark, isBookmarked };
}
