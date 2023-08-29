import { UserInDB } from '@/model/user';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Avatar from './ui/Avatar';

type Props = {
  // children: React.ReactNode;
  following: UserInDB[] | undefined;
};

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 6,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    // slidesToSlide: 3,
  },
};
const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <button
      className="bg-transparent rounded-full right-3  absolute outline-none z-1000 border-0 min-w-[43px] min-h-[43px] cursor-pointer before:content-['>'] hover:bg-black hover:opacity-70 text-white text-3xl  transition-all duration-500"
      onClick={() => onClick()}
    />
  );
};

const CustomLeftArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <button
      className="bg-transparent rounded-full left-0  absolute outline-none z-1000 border-0 min-w-[43px] min-h-[43px] cursor-pointer before:content-['<'] hover:bg-black hover:opacity-70 text-white text-3xl  transition-all duration-500"
      onClick={() => onClick()}
    />
  );
};

export default function FollowingCarousel({ following }: Props) {
  console.log('FollowingCarousel: following: ', following);
  if (!following) {
    return;
  }
  return (
    <Carousel
      ssr={true}
      infinite={true}
      responsive={responsive}
      containerClass={'w-[560px]'}
      itemClass={'w-[130px]'}
      partialVisible={false}
      customRightArrow={<CustomRightArrow />}
      customLeftArrow={<CustomLeftArrow />}
    >
      {following.map((user: UserInDB) => (
        <div
          key={user._id}
          className=" flex flex-col justify-center items-center w-20"
        >
          <div className="flex-grow">
            <Avatar image={user.image} highlight />
          </div>
          <p className="flex-grow">{user.username}</p>
        </div>
      ))}
    </Carousel>
  );
}
