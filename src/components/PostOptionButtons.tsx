import { Selected } from './UserPage';
import { GridIcon, HeartIcon } from './ui/icons';
import BookMarkIcon from './ui/icons/BookmarkIcon';

const BUTTON_CONTAINER_CLASS = 'flex items-center p-5';
const BORDER_TOP_CLASS = 'border-t-2 border-neutral-400';

type Props = {
  selected: Selected;
  onClick: (event: React.MouseEvent) => void;
};
export default function PostOptionButtons({ selected, onClick }: Props) {
  return (
    <div className="flex gap-8 text-xl ">
      <div
        className={`${BUTTON_CONTAINER_CLASS} ${
          selected === 'posts' && BORDER_TOP_CLASS
        }`}
      >
        <GridIcon width="w-5" height="h-5" />
        <button
          onClick={onClick}
          name="posts"
          className={`${selected === 'posts' && 'font-bold'}`}
        >
          POSTS
        </button>
      </div>

      <div
        className={`${BUTTON_CONTAINER_CLASS} ${
          selected === 'saved' && BORDER_TOP_CLASS
        }`}
      >
        <BookMarkIcon width="w-5" height="h-5" />
        <button
          onClick={onClick}
          name="saved"
          className={`${selected === 'saved' && 'font-bold'}`}
        >
          SAVED
        </button>
      </div>

      <div
        className={`${BUTTON_CONTAINER_CLASS} ${
          selected === 'liked' && BORDER_TOP_CLASS
        }`}
      >
        <HeartIcon width="w-5" height="h-5" />
        <button
          onClick={onClick}
          name="liked"
          className={`${selected === 'liked' && 'font-bold'}`}
        >
          LIKED
        </button>
      </div>
    </div>
  );
}
