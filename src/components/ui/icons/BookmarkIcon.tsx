import { RiBookmarkLine } from 'react-icons/ri';

type Props = {
  width?: string;
  height?: string;
};
export default function BookMarkIcon({ width = 'w-7', height = 'h-7' }: Props) {
  return <RiBookmarkLine className={`${width} ${height}`} />;
}
