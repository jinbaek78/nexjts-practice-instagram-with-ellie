'use client';

import ColorButton from '@/components/ui/ColorButton';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';

export default function SignInPage() {
  const pathname = usePathname();
  console.log('signIn page: pathname', pathname);
  return (
    <div className="flex justify-center mt-12 ">
      <div className="p-3">
        <ColorButton
          text="Signin with google"
          onClick={() => {
            // signIn('google', { callbackUrl: '/new' });
            signIn('google', { redirect: true });
          }}
          padding="p-[0.8rem]"
          textSize="text-2xl"
        />
      </div>
    </div>
  );
}
