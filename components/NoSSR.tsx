'use client';

import { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function NoSSR({ children, fallback = null }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <>{mounted ? children : fallback}</>;
}

export function withNoSSR<T>(Component: React.ComponentType<T>) {
  return function NoSSRComponent(props: T) {
    return (
      <NoSSR>
        <Component {...(props as any)} />
      </NoSSR>
    );
  };
}
