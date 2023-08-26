'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  HomeFillIcon,
  HomeIcon,
  NewFIllIcon,
  NewIcon,
  SearchIcon,
  SearchFillIcon,
} from '@/components/ui/icons';
import { redirect, usePathname } from 'next/navigation';
import ColorButton from './ui/ColorButton';
const menu = [
  {
    href: '/',
    icon: <HomeIcon />,
    clickedIcon: <HomeFillIcon />,
  },
  {
    href: '/search',
    icon: <SearchIcon />,
    clickedIcon: <SearchFillIcon />,
  },
  {
    href: '/new',
    icon: <NewIcon />,
    clickedIcon: <NewFIllIcon />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  console.log('NavBar: session: ', session);
  return (
    <div className="flex justify-between items-center px-6">
      <Link href={'/'}>
        <h1 className="text-3xl font-bold">Instagram</h1>
      </Link>
      <nav>
        <ul className="flex gap-4 items-center p-4">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                {pathname === item.href ? item.clickedIcon : item.icon}
              </Link>
            </li>
          ))}

          {session ? (
            <ColorButton
              text="Sign out"
              onClick={() => {
                signOut();
              }}
            />
          ) : (
            <ColorButton
              text="Sign in"
              onClick={() => {
                signIn();
              }}
            />
          )}
        </ul>
      </nav>
    </div>
  );
}
