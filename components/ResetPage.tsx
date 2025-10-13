'use client';

interface ResetPageProps {
  reset: () => void;
}

export function ResetPage({ reset }: ResetPageProps) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: 'red' }}>Something went wrong!</h2>
      <button 
        onClick={() => reset()} 
        style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
