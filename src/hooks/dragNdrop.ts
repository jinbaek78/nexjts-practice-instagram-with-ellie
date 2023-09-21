import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export default function useDragNDrop(
  setUploadedImage: Dispatch<SetStateAction<File | undefined>>
) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const dt = event.dataTransfer;
      const imageFile = dt.files[0];
      imageFile && setUploadedImage(imageFile);
      setIsDragging(false);
    },
    [setUploadedImage]
  );

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const onDragOut = useCallback((event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(false);
  }, []);

  return {
    onDrop,
    onDragEnter,
    onDragOver,
    onDragOut,
    isDragging,
  };
}
