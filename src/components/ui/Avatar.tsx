type Props = {
  image?: string | null;
  size?: 'small' | 'medium' | 'big';
  highLight?: boolean;
};

const IMAGE_CONTAINER_CLASS =
  'rounded-full bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300';

const IMAGE_CLASS = 'rounded-full';

export default function Avatar({
  image,
  size = 'small',
  highLight = true,
}: Props) {
  console.log();
  return (
    <div
      className={`${IMAGE_CONTAINER_CLASS} ${size === 'small' && 'w-7 h-7'} ${
        size === 'medium' && 'w-12 h-12'
      } ${size === 'big' && 'w-20 h-20'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${IMAGE_CLASS} ${highLight && 'p-[0.1rem]'}`}
        alt="user profile"
        src={image ?? undefined}
      />
    </div>
  );
}
