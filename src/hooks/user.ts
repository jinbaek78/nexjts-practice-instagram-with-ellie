import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function useProfileUser(username: string) {
  const { data: user, isLoading } = useSWR(`/api/user/${username}`);
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchUrl = '/api/following';
  const method = 'PUT';

  const updateFollowing = (id: string, type: string, username: string) => {
    setIsUpdating(true);
    return fetch(fetchUrl, {
      method,
      body: JSON.stringify({
        id,
        type: type.toLowerCase(),
        username,
      }),
    }).then(() => {
      setIsUpdating(false);
      mutate(`/api/user/${username}`);
      mutate('/api/me');
    });
  };

  return { user, isLoading, isUpdating, updateFollowing };
}
