'use client';

import Image from 'next/image';
import React, { FormEvent, useState } from 'react';

import { Mail, Lock } from 'lucide-react';
import LoginInput from './_components/login-input';
import { Button } from '@/components/ui/button';
import login from '@/services/authServices';
import { useRouter } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';

const page = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    if (!re.test(email)) {
      return 'Invalid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }

    return '';
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setEmailError(emailError);
    setPasswordError(passwordError);

    if (!emailError && !passwordError) {
      console.log('form submitted');
      callLogin();
    }
  };

  const callLogin = async () => {
    setIsLoading(true);
    const { success, error } = await login(email, password);
    setIsLoading(false);
    if (success) {
      router.push('/stations');
    } else {
      console.log('Invalid login credentials. Please try again.');
      // toast.error(error || 'Failed to login. Please try again.');
      toast.error(error || 'Failed to login. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className=' w-11/12 bg-primary rounded lg:w-3/12'>
        <div className='w-full flex justify-center border-b border-[#ffffff1f] py-4 lg:py-8'>
          <Image
            className='w-9 lg:w-[75px]'
            src='/images/logo.png'
            width={75}
            height={37}
            alt='logo'
          />
        </div>
        <div className='p-4 lg:p-8'>
          <div>
            <h3 className='font-semibold text-lg text-white lg:text-2xl'>
              Sign In
            </h3>
            <p className='text-white text-xs mt-1'>
              Login to your account to continue the process
            </p>
          </div>

          <form className='flex flex-col gap-8 my-8' onSubmit={handleSubmit}>
            <div>
              <LoginInput
                type='email'
                placeholder='Enter your email'
                icon={<Mail size={15} color='#87898E' className='mt-1' />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className='text-red-500 text-sm'>{emailError}</div>
              )}
            </div>
            <div>
              {' '}
              <LoginInput
                type='password'
                placeholder='Enter your email'
                icon={<Lock size={15} color='#87898E' className='mt-1' />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className='text-red-500 text-sm'>{passwordError}</div>
              )}
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full lg:h-[50px] bg-[#0BF1A7] hover:bg-[#3effc2] text-black rounded'
            >
              {isLoading ? 'Loading...' : 'Sign in'}
            </Button>
          </form>
          <p className='text-xs text-white cursor-pointer'>
            Forgot Your Password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
