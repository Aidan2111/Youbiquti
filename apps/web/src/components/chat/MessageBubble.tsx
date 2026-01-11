// MessageBubble component

import type { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    // Convert **bold** to <strong>
    let formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-gray-800 text-gray-100 rounded-bl-md'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400">GNO Assistant</span>
          </div>
        )}
        <div 
          className="message-content text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        <div className={`text-xs mt-1 ${isUser ? 'text-primary-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: 'numeric', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}
