'use client';

import { useEffect } from 'react';
import { ResetPage } from '@/components/ResetPage';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log error to console
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ResetPage reset={reset} />
      </body>
    </html>
  );
}
