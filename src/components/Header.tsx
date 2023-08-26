'use client';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { AiFillHome } from 'react-icons/ai';
import { BsPlusSquare } from 'react-icons/bs';
import { BsPlusSquareFill } from 'react-icons/bs';
import { RiSearchLine } from 'react-icons/ri';
import { RiSearchFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const HOME_URL = '/';
const SEARCH_URL = '/search';
const NEW_URL = '/new';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    console.log('header, window.pageYOffset: ', window.pageYOffset);
    console.log('headerRef: ', headerRef.current?.offsetTop);
  }, []);
  return (
    <header
      className="  w-full max-w-screen-2xl text-5xl flex justify-between p-8 px-5  bg-white"
      ref={headerRef}
    >
      <Link href={'/'} className="font-bold">
        Instagram
      </Link>
      <div className="flex gap-10">
        <Link href={'/'}>
          {pathname === HOME_URL ? <AiFillHome /> : <AiOutlineHome />}
        </Link>

        <Link href={'/search'}>
          {pathname === SEARCH_URL ? <RiSearchFill /> : <RiSearchLine />}
        </Link>

        <Link href={'/new'}>
          {pathname === NEW_URL ? <BsPlusSquareFill /> : <BsPlusSquare />}
        </Link>

        <button
          className="text-2xl p-1 flex flex-col justify-center items-center
        bg-gradient-to-bl from-pink-500 via-red-500 to-yellow-500 rounded-lg "
        >
          <p className="bg-white w-full h-full rounded-lg p-2 hover:bg-red-100">
            Sign in
          </p>
        </button>
      </div>
    </header>
  );
}
