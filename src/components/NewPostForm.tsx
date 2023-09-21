'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import Button from './ui/Button';
import { PhotoVideoIcon } from './ui/icons';
import { GridLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import ModalPortal from './ui/ModalPortal';
import useDragNDrop from '@/hooks/dragNdrop';
import usePublication from '@/hooks/newPost';

export default function NewPostForm() {
  const [uploadedImage, setUploadedImage] = useState<File | undefined>();
  const [text, setText] = useState('');
  const { publishPost, isPublishing } = usePublication();
  const { onDrop, onDragEnter, onDragOver, onDragOut, isDragging } =
    useDragNDrop(setUploadedImage);
  const router = useRouter();

  console.time('creatingImageURL');
  const imageUrl = useMemo(
    () => (uploadedImage ? URL.createObjectURL(uploadedImage as Blob) : ''),
    [uploadedImage]
  );
  console.timeEnd('creatingImageURL');
  console.log(isPublishing);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!uploadedImage || !text) {
      return;
    }

    console.time('publishing new post');
    await publishPost(uploadedImage, text);
    console.timeEnd('publishing new post');

    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  const handleTextChange = (event: React.ChangeEvent) => {
    const textArea = event.target as HTMLTextAreaElement;
    textArea && setText(textArea.value);
  };

  const handleImageChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const imageFile = target.files?.[0];
    imageFile && setUploadedImage(imageFile);
  };

  return (
    <form
      onDragEnter={onDragEnter}
      onSubmit={handleSubmit}
      className="relative w-full h-[70vh] flex flex-col z-100"
    >
      {isPublishing && (
        <div className=" absolute top-1/2 left-1/2">
          <GridLoader color="red" />
        </div>
      )}
      <label
        htmlFor="file"
        className={`relative w-full min-h-[30%] border-dashed border-sky-500 basis-1/2 ${
          !uploadedImage && 'border-2 dr'
        }`}
      >
        {!uploadedImage && (
          <div className="w-full h-full pb-7 flex flex-col justify-center items-center">
            <PhotoVideoIcon />
            <p className="text-2xl text-center mt-2">
              Drag and Drop you image here or click
            </p>
          </div>
        )}
        {uploadedImage && (
          <Image
            src={imageUrl}
            alt="user image"
            className="object-cover"
            fill
          />
        )}
      </label>
      <input
        // className="clip-pattern"
        className="hidden"
        onChange={handleImageChange}
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
      />
      <textarea
        className="w-full min-h-[30%] basis-1/2 text-2xl outline-none"
        cols={50}
        onChange={handleTextChange}
        value={text}
        placeholder="Write a caption..."
      />
      <div className="w-full h-[3.2rem] text-xl">
        <Button text="Publish" onClick={() => {}} disabled={isPublishing} />
      </div>
      {(isDragging || isPublishing) && (
        <ModalPortal>
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragOut}
            className="fixed top-0 left-0 w-full h-full  bg-sky-300/40 z-10"
          ></div>
        </ModalPortal>
      )}
    </form>
  );
}
