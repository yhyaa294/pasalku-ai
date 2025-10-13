import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSession } from 'next-auth/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();
  
  // We need to type cast here because the session object from next-auth
  // doesn't have our custom accessToken property by default.
  const token = (session as any)?.accessToken;

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  // Ensure the URL is correctly formed, assuming the input `url` is a relative path
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  const response = await fetch(apiUrl, {
    ...options,
    headers,
  });

  return response;
}

