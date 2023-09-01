import { useState } from 'react';

const DEBOUNCE_TIME = 500;
let timeoutId: NodeJS.Timeout | undefined;

export default function useDebounce(): [string, (query: string) => void] {
  const [userQuery, setUserQuery] = useState('');

  const handleDebounce = (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUserQuery(query);
      }, DEBOUNCE_TIME);
      return;
    }

    timeoutId = setTimeout(() => {
      setUserQuery(query);
    }, DEBOUNCE_TIME);
  };

  return [userQuery, handleDebounce];
}
