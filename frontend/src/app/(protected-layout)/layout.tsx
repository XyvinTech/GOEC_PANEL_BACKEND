'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { Gauge, LogOut, Plus, UploadCloud } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { useAppSelector } from '@/lib/hooks';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { smallSidebar } = useAppSelector((state) => state.sidebar);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const sidebarVariants = {
    short: { width: '5%' }, // Adjust width as needed for "short" state
    wide: { width: '16%' }, // Adjust width as needed for "wide" state
  };

  const handleSignOut = () => {
    Cookies.remove('token', { path: '/' });
    router.push('/login');
  };

  return (
    <div className='w-full flex overflow-hidden h-screen'>
      <motion.div
        className='shrink-0 bg-primary'
        variants={sidebarVariants} // Apply animation variants
        animate={smallSidebar ? 'short' : 'wide'}
        transition={{ duration: 0.5 }}
      >
        <div className='p-4'>
          <Image
            className=''
            src='/images/logo.png'
            width={75}
            height={37}
            alt='logo'
          />
        </div>

        <div className='flex flex-col'>
          <Link
            href='/add'
            className={cn(
              'h-fit flex items-center gap-2 py-2 px-6 text-base text-[#dadada] hover:bg-blue-600 min-h-12',
              isActivePath('/add') && 'bg-white text-primary hover:bg-white'
            )}
          >
            <Plus
              color={isActivePath('/add') ? '#13F2AD' : '#dadada'}
              size={20}
            />

            {!smallSidebar && 'Add stations'}
          </Link>

          <Link
            href='/stations'
            className={cn(
              'h-fit flex items-center gap-2 py-2 px-6 text-base text-[#dadada] hover:bg-blue-600',
              isActivePath('/stations') &&
              'bg-white text-primary hover:bg-white'
            )}
          >
            <Gauge
              color={isActivePath('/stations') ? '#13F2AD' : '#dadada'}
              size={20}
            />
            {!smallSidebar && 'Charging stations'}
          </Link>

          <Link
            href='/upload'
            className={cn(
              'h-fit flex items-center gap-2 py-2 px-6 text-base text-[#dadada] hover:bg-blue-600',
              isActivePath('/upload') &&
              'bg-white text-primary hover:bg-white'
            )}
          >
            <UploadCloud
              color={isActivePath('/upload') ? '#13F2AD' : '#dadada'}
              size={20}
            />
            {!smallSidebar && 'Bulk Upload'}
          </Link>

          <button
            onClick={handleSignOut}
            className='h-fit cursor-pointer flex items-center gap-2 py-2 px-6 text-base text-[#dadada] hover:bg-blue-600'
          >
            <LogOut color='#dadada' size={20} />
            {!smallSidebar && 'Sign Out'}
          </button>
        </div>
      </motion.div>

      <div className='flex-grow overflow-y-auto bg-[#f5f5f5]'>{children}</div>
    </div>
  );
};

export default ProtectedLayout;
