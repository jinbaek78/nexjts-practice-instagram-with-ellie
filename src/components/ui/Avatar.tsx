import Image from 'next/image';
import Link from 'next/link';

type Props = {
  src: string;
  width?: number;
  redirectTo?: string;
};
export default function Avatar({ src, width = 100, redirectTo }: Props) {
  return (
    <Link href={redirectTo || '/'}>
      <div className="rounded-full bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300 p-[0.15rem]">
        <Image
          className="rounded-full"
          src={src || ''}
          alt="userAvatar"
          width={width}
          height={100}
        />
      </div>
    </Link>
  );
}
