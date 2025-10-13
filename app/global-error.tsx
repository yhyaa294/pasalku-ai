'use client';

import { useEffect } from 'react';
import Rollbar from 'rollbar';
import { clientConfig } from '@/lib/rollbar';
import { ResetPage } from '@/components/ResetPage';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Root layout and template are not available in the error page
    // so we don't have the RollbarProvider available to use the
    // useRollbar hook so we need to create a new Rollbar instance here
    const rollbar = new Rollbar(clientConfig);

    rollbar.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <ResetPage reset={reset} />
      </body>
    </html>
  );
}
