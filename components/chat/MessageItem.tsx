'use client';

import { Message } from '@/types/chat';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  onRetry?: (messageId: string) => void;
}

export function MessageItem({ message, isCurrentUser, onRetry }: MessageItemProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 relative ${
          isCurrentUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        } ${message.status === 'failed' ? 'border border-red-300' : ''}`}
      >
        {message.status === 'sending' && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
            Mengirim...
          </div>
        )}
        {message.status === 'failed' && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <span className="mr-1">Gagal</span>
            <button
              onClick={() => onRetry?.(message.id)}
              className="hover:underline"
              title="Coba lagi"
            >
              🔄
            </button>
          </div>
        )}

        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {message.attachments?.map((url, index) => (
          <div key={index} className="mt-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-500 hover:underline"
            >
              📎 Lampiran {index + 1}
            </a>
          </div>
        ))}

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs opacity-70">
            {format(new Date(message.timestamp), 'HH:mm', { locale: id })}
          </p>
          {isCurrentUser && (
            <span className="text-xs opacity-70 ml-2">
              {message.status === 'sent' && '✓✓'}
              {message.status === 'sending' && '...'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
