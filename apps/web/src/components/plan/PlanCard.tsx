// PlanCard component - displays a single item in the night plan

import type { PlanItem } from '../../types';

interface PlanCardProps {
  item: PlanItem;
  index: number;
}

export function PlanCard({ item, index }: PlanCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'restaurant':
        return '🍽️';
      case 'bar':
        return '🍸';
      case 'event':
        return '🎭';
      case 'transit':
        return '🚗';
      default:
        return '📍';
    }
  };
  
  const formatTime = (time?: string) => {
    if (!time) return '';
    
    // Handle ISO datetime
    if (time.includes('T')) {
      return new Date(time).toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
    
    // Handle HH:mm format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours! >= 12 ? 'PM' : 'AM';
    const displayHour = hours! % 12 || 12;
    return `${displayHour}:${minutes!.toString().padStart(2, '0')} ${period}`;
  };
  
  const details = item.details as Record<string, any>;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-primary-500 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-xl">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
              {index + 1}
            </span>
            {item.time && (
              <span className="text-xs text-gray-400">
                {formatTime(item.time)}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-100 mt-1 truncate">
            {item.name}
          </h3>
          
          {/* Type-specific details */}
          {item.type === 'restaurant' && details.cuisine && (
            <p className="text-sm text-gray-400 mt-1">
              {details.cuisine} • {details.neighborhood}
            </p>
          )}
          
          {item.type === 'bar' && details.barType && (
            <p className="text-sm text-gray-400 mt-1">
              {details.barType} • {(details.vibes || []).slice(0, 2).join(', ')}
            </p>
          )}
          
          {item.type === 'event' && details.venue && (
            <p className="text-sm text-gray-400 mt-1">
              {details.eventType} at {details.venue}
            </p>
          )}
          
          {/* Duration if available */}
          {item.duration && (
            <p className="text-xs text-gray-500 mt-1">
              ~{item.duration} min
            </p>
          )}
        </div>
        
        {/* Confirmation status */}
        <div className="flex-shrink-0">
          {item.confirmed ? (
            <span className="text-green-400 text-lg">✓</span>
          ) : (
            <span className="text-gray-600 text-lg">○</span>
          )}
        </div>
      </div>
    </div>
  );
}
