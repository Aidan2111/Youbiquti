// PlanSidebar component - displays the current night plan with mobile drawer support

import { X, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import type { NightPlan, AgentState } from '../../types';
import { PlanCard } from './PlanCard';

interface PlanSidebarProps {
  plan: NightPlan | null;
  state: AgentState;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirmItem?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
}

export function PlanSidebar({
  plan,
  state,
  isOpen = true,
  onClose,
  onConfirmItem,
  onRemoveItem,
}: PlanSidebarProps) {
  const getStateLabel = () => {
    switch (state) {
      case 'greeting':
        return "Let's get started!";
      case 'gathering':
        return 'Gathering details...';
      case 'searching':
        return 'Finding options...';
      case 'presenting':
        return 'Here are your options';
      case 'refining':
        return 'Refining search...';
      case 'confirming':
        return 'Almost there!';
      case 'complete':
        return "You're all set!";
      default:
        return 'Planning...';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case 'greeting':
        return '👋';
      case 'gathering':
        return '📝';
      case 'searching':
        return '🔍';
      case 'presenting':
        return '✨';
      case 'refining':
        return '🎯';
      case 'confirming':
        return '📋';
      case 'complete':
        return '🎉';
      default:
        return '💭';
    }
  };

  // Calculate total estimated time
  const getTotalDuration = () => {
    if (!plan) return null;
    const totalMinutes = plan.items.reduce((sum, item) => sum + (item.duration || 0), 0);
    if (totalMinutes === 0) return null;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-80 border-l border-gray-700 bg-gray-900/95 lg:bg-gray-900/50
          flex flex-col backdrop-blur-sm lg:backdrop-blur-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-100">Your Night Plan</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg">{getStateIcon()}</span>
            <p className="text-sm text-primary-400">{getStateLabel()}</p>
          </div>
        </div>

        {/* Plan items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!plan || plan.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-gray-400 text-sm">
                Your itinerary will appear here as we plan your night!
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Tell me what you're looking for and I'll help you find the perfect spots.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Timeline connector */}
              <div className="relative">
                {plan.items.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Vertical connector line */}
                    {index < plan.items.length - 1 && (
                      <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-gray-700 -mb-3 z-0" />
                    )}
                    <div className="relative z-10 mb-3">
                      <PlanCard
                        item={item}
                        index={index}
                        onConfirm={onConfirmItem}
                        onRemove={onRemoveItem}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary footer */}
        {plan && plan.items.length > 0 && (
          <div className="p-4 border-t border-gray-700 bg-gray-800/50 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {plan.items.length} {plan.items.length === 1 ? 'stop' : 'stops'}
              </span>
              {getTotalDuration() && (
                <span className="text-gray-400">~{getTotalDuration()}</span>
              )}
            </div>
            {plan.estimatedCost && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Estimated total
                </span>
                <span className="text-gray-200 font-medium">
                  ${plan.estimatedCost.min} - ${plan.estimatedCost.max}
                </span>
              </div>
            )}

            {/* Progress indicator */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Plan progress</span>
                <span>
                  {plan.items.filter((i) => i.confirmed).length}/{plan.items.length} confirmed
                </span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-green-500 transition-all duration-300"
                  style={{
                    width: `${
                      (plan.items.filter((i) => i.confirmed).length / plan.items.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Mobile toggle button component
export function PlanToggleButton({
  onClick,
  planCount,
}: {
  onClick: () => void;
  planCount: number;
}) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-24 right-4 z-30 flex items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
    >
      <span className="text-sm font-medium">View Plan</span>
      {planCount > 0 && (
        <span className="flex items-center justify-center w-5 h-5 bg-white text-primary-500 text-xs font-bold rounded-full">
          {planCount}
        </span>
      )}
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}
