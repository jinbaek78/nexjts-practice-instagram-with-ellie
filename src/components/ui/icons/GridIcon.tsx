import { BiGrid } from 'react-icons/bi';

type Props = {
  width?: string;
  height?: string;
};
export default function GridIcon({ width = 'w-7', height = 'h-7' }: Props) {
  return <BiGrid className={`${width} ${height}`} />;
}
