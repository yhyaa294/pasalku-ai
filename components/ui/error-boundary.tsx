'use client';

import { useEffect, useState } from 'react';
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ reset: () => void }>;
}

export function ErrorBoundary({ children, fallback: Fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, []);

  return (
    <RollbarErrorBoundary
      fallbackUI={({ resetError }) => (
        Fallback ? (
          <Fallback reset={() => {
            setHasError(false);
            resetError();
          }} />
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Something went wrong!
              </h1>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setHasError(false);
                  resetError();
                }}
              >
                Try again
              </button>
            </div>
          </div>
        )
      )}
    >
      {children}
    </RollbarErrorBoundary>
  );
}