'use client';
import { Post } from '@/model/post';
import Avatar from './ui/Avatar';
import Image from 'next/image';
import {
  HeartIcon,
  HeartFillIcon,
  BookMarkIcon,
  BookMarkFillIcon,
  SmileIcon,
} from '@/components/ui/icons';

import { format } from 'timeago.js';
import { ChangeEvent, useState } from 'react';

const icons = [
  {
    icon: <HeartIcon />,
    markedIcon: <HeartFillIcon />,
    onClick: () => {},
  },
  {
    icon: <BookMarkIcon />,
    markedIcon: <BookMarkFillIcon />,
    onClick: () => {},
  },
];

type Props = {
  post: Post;
};
export default function PostFormCard({ post }: Props) {
  const [text, setText] = useState('');
  const { author, comments, createdAt, id, likes, postImageUrl } = post;
  const { image, username } = author;

  const handleTextChange = (e: ChangeEvent) => {
    setText((e.target as HTMLInputElement).value);
  };
  return (
    <li className="mb-8">
      <form
        className="shadow-md rounded-lg "
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex gap-2 my-2 p-1 items-center  rounded-lg">
          <Avatar image={image} highlight size="small" />
          <p className="font-semibold">{username}</p>
        </div>
        <Image
          className="w-full object-cover"
          src={postImageUrl}
          alt="postImage"
          width={500}
          height={500}
          style={{ height: '600px' }}
        />
        <div className="p-3 text-sm">
          <ul className="flex justify-between text-base">
            {icons.map((icon, index) => (
              <li key={index}>{icon.icon}</li>
            ))}
          </ul>
          <p className="font-semibold my-2">
            {likes ? likes.length : 0} Like
            {likes?.length && likes.length > 1 ? 's' : ''}
          </p>
          {comments && (
            <div className="flex gap-2 my-2">
              <p className="font-bold">{comments[0].author.username}</p>
              <p>{comments[0].comment}</p>
            </div>
          )}
          <p className="text-neutral-400 my-2">{format(createdAt)}</p>
        </div>
        <div className="w-full flex items-center">
          <p className="p-3">
            <SmileIcon />
          </p>
          <input
            className="flex-grow p-2 px-3 text-base outline-none"
            onChange={handleTextChange}
            value={text}
            type="text"
            placeholder="Add a comment"
          />
          <div className="flex justify-center items-center p-2">
            <button className="text-sky-500 font-bold" type="submit">
              Post
            </button>
          </div>
        </div>
      </form>
    </li>
  );
}
