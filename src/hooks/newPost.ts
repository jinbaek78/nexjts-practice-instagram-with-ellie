import { useCallback, useState } from 'react';

export default function usePublication() {
  const [isPublishing, setIsPublishing] = useState(false);

  const publishPost = useCallback(async (imageFile: File, caption: string) => {
    const data = new FormData();
    data.append('image', imageFile);
    data.append('text', caption);

    setIsPublishing(true);
    await fetch('/api/publish', {
      method: 'POST',
      body: data,
    });
    setIsPublishing(false);
    return;
  }, []);

  return {
    publishPost,
    isPublishing,
  };
}
