import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getSession, Session } from 'next-auth/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CustomSession extends Session {
  accessToken?: string;
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const session = await getSession();

  const token = (session as CustomSession)?.accessToken;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure the URL is correctly formed, assuming the input `url` is a relative path
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  const response = await fetch(apiUrl, {
    ...options,
    headers,
  });

  return response;
}
// Re-export or add other utilities as needed to ensure fetchWithAuth is properly exported
