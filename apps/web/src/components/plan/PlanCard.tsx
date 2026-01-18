// PlanCard component - displays a single item in the night plan with interactions

import { Check, Clock, MapPin, Star, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { PlanItem } from '../../types';

interface PlanCardProps {
  item: PlanItem;
  index: number;
  onConfirm?: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}

export function PlanCard({ item, index, onConfirm, onRemove }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);

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
        minute: '2-digit',
      });
    }

    // Handle HH:mm format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours! >= 12 ? 'PM' : 'AM';
    const displayHour = hours! % 12 || 12;
    return `${displayHour}:${minutes!.toString().padStart(2, '0')} ${period}`;
  };

  const details = item.details as Record<string, unknown>;

  const getPriceDisplay = () => {
    const priceLevel = details.priceLevel as number | undefined;
    if (!priceLevel) return null;
    return '$'.repeat(priceLevel);
  };

  const getRatingDisplay = () => {
    const rating = details.rating as number | undefined;
    if (!rating) return null;
    return rating.toFixed(1);
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
        item.confirmed
          ? 'border-green-500/50 bg-green-500/5'
          : 'border-gray-700 hover:border-primary-500/50'
      }`}
    >
      {/* Main card content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
              item.confirmed ? 'bg-green-500/20' : 'bg-primary-500/20'
            }`}
          >
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
                {index + 1}
              </span>
              {item.time && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.time)}
                </span>
              )}
              {getPriceDisplay() && (
                <span className="text-xs text-amber-400">{getPriceDisplay()}</span>
              )}
            </div>

            <h3 className="font-semibold text-gray-100 mt-1 truncate">{item.name}</h3>

            {/* Quick details */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {item.type === 'restaurant' && typeof details.cuisine === 'string' && (
                <span className="text-xs text-gray-400">{details.cuisine}</span>
              )}
              {item.type === 'bar' && Array.isArray(details.vibes) && (
                <span className="text-xs text-gray-400">
                  {(details.vibes as string[]).slice(0, 2).join(', ')}
                </span>
              )}
              {getRatingDisplay() && (
                <span className="text-xs text-amber-400 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  {getRatingDisplay()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50 pt-3 space-y-2">
          {/* Address */}
          {typeof details.address === 'string' && (
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{details.address}</span>
            </div>
          )}

          {/* Duration */}
          {typeof item.duration === 'number' && item.duration > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>~{item.duration} minutes</span>
            </div>
          )}

          {/* Type-specific expanded details */}
          {item.type === 'restaurant' && typeof details.neighborhood === 'string' && (
            <p className="text-sm text-gray-400">
              Located in {details.neighborhood}
            </p>
          )}

          {item.type === 'event' && typeof details.venue === 'string' && (
            <p className="text-sm text-gray-400">
              {typeof details.eventType === 'string' ? details.eventType : 'Event'} at {details.venue}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {!item.confirmed && onConfirm && (
              <button
                onClick={() => onConfirm(item.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            )}
            {item.confirmed && (
              <div className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                <Check className="w-4 h-4" />
                Confirmed
              </div>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                title="Remove from plan"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick confirm status indicator */}
      {!expanded && item.confirmed && (
        <div className="px-4 pb-3 -mt-1">
          <span className="text-xs text-green-400 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Confirmed
          </span>
        </div>
      )}
    </div>
  );
}
