'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/state/auth';

export function AuthButton() {
  const router = useRouter();
  const { user, signOut } = useAuthStore(({ user, signOut }) => ({
    user,
    signOut,
  }));

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  return user ? (
    <div className="flex items-center gap-4">
      <button onClick={handleSignOut} className="btn btn-sm btn-primary">
        Sign out
      </button>
    </div>
  ) : (
    <Link href="/login" className="btn btn-sm btn-primary">
      Sign in
    </Link>
  );
}
