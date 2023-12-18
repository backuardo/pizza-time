'use client';
import { useEffect, useState } from 'react';

import { PizzaList } from '@/components/pizza-list';
import { Header } from '@/components/header';
import { ErrorToasts } from '@/components/error-toasts';
import { useAuthStore } from '@/state/auth';

export default function Index() {
  // HACK: This is a workaround for a bug in Zustand persist
  // where rehydration is not working properly w/ Next.
  // See: https://github.com/pmndrs/zustand/issues/938#issuecomment-1812606279
  const [hasHydrated, setHasHydrated] = useState(false);

  const user = useAuthStore(({ user }) => user);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="w-full p-4 space-y-8">
      <Header />
      <main className="flex flex-col items-center">
        {user ? (
          <PizzaList />
        ) : (
          <div className="text-2xl">
            Please sign in or sign up to create pizza recipes
          </div>
        )}
        <ErrorToasts />
      </main>
    </div>
  );
}
