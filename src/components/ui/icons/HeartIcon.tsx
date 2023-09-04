import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
  width?: string;
  height?: string;
};
export default function HeartIconP({ width = 'w-7', height = 'h-7' }: Props) {
  return <AiOutlineHeart className={`${width} ${height}`} />;
}
