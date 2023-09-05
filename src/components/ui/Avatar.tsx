type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

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
        className={`bg-white object-cover rounded-full aspect-square ${
          getImageSizeStyle(size).image
        }`}
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
  const { container } = getImageSizeStyle(size);
  return `${baseStyle} ${highlightStyle} ${container}`;
}

type ImageSizeStyle = {
  container: string;
  image: string;
};

function getImageSizeStyle(size: AvatarSize): ImageSizeStyle {
  switch (size) {
    case 'small':
      return {
        image: 'w-[34px] h-34px] p-[0.1rem]',
        container: 'w-9 h-9',
      };
    case 'medium':
      return {
        image: 'w-[41px] h-[41px] p-[0.1rem]',
        container: 'w-11 h-11',
      };
    case 'large':
      return {
        image: 'w-15 h-15 p-[0.15rem]',
        container: 'w-[68px] h-[68px]',
      };
    case 'xlarge':
      return {
        image: 'w-[138px] h-[138px] p-[0.2rem]',
        container: 'w-[142px] h-[142px]',
      };
    default:
      throw new Error(`Unsupported type size: ${size}`);
  }
}
