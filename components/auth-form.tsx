'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/state/auth';

export function AuthForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isNewSignUp, setIsNewSignUp] = useState(false);
  const { signIn, signUp } = useAuthStore(({ signIn, signUp }) => ({
    signIn,
    signUp,
  }));
  const router = useRouter();

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await signIn(credentials);
    router.push('/');
  };

  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await signUp(credentials);
    setIsNewSignUp(true);
  };

  const handleChangeCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  if (isNewSignUp) {
    return (
      <div className="flex flex-col w-full justify-center">
        <p className="text-center text-lg">
          Please check your email to verify your account.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col w-full justify-center gap-2 max-w-xl">
      <label className="label-text" htmlFor="email">
        Email
      </label>
      <input
        className="input input-bordered"
        name="email"
        placeholder="you@example.com"
        required
        onChange={handleChangeCredentials}
      />
      <label className="label-text" htmlFor="password">
        Password
      </label>
      <input
        className="input input-bordered"
        type="password"
        name="password"
        placeholder="••••••••"
        required
        onChange={handleChangeCredentials}
      />
      <div className="w-full flex flex-col gap-2 mt-4">
        <button onClick={handleSignIn} className="btn btn-accent">
          Sign In
        </button>
        <button onClick={handleSignUp} className="btn">
          Sign Up
        </button>
      </div>
    </form>
  );
}
