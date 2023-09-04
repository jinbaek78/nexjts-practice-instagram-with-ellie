type AvatarSize = 'small' | 'medium' | 'large' | 'xLarge';

type Props = {
  image?: string | null;
  size?: AvatarSize;
  highlight?: boolean;
};
export default function Avatar({
  image,
  size = 'large',
  highlight = false,
}: Props) {
  return (
    <div className={getContainerStyle(size, highlight)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`bg-white object-cover rounded-full aspect-square ${getImageSizeStyle(
          size
        )}`}
        alt="user profile"
        src={image ?? undefined}
      />
    </div>
  );
}

function getContainerStyle(size: AvatarSize, highlight: boolean): string {
  const baseStyle = `rounded-full flex justify-center item-center`;
  const highlightStyle = highlight
    ? 'bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300 p-[0.1rem]'
    : '';
  const sizeStyle = getContainerSize(size);
  return `${baseStyle} ${highlightStyle} ${sizeStyle}`;
}

function getContainerSize(size: AvatarSize): string {
  switch (size) {
    case 'small':
      return 'w-9 h-9';
    case 'medium':
      return 'w-11 h-11';
    case 'large':
      return 'w-[68px] h-[68px]';
    case 'xLarge':
      return 'w-[180px] h-[180px]';
  }
}

function getImageSizeStyle(size: AvatarSize): string {
  switch (size) {
    case 'small':
      return 'w-[34px] h-34px] p-[0.1rem]';
    case 'medium':
      return 'w-[41px] h-[41px] p-[0.1rem]';
    case 'large':
      return 'w-15 h-15 p-[0.2rem]';
    case 'xLarge':
      return 'w-21 h-21 p-[0.2rem]';
  }
}
