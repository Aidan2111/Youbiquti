// PlanSidebar component - displays the current night plan

import type { NightPlan, AgentState } from '../../types';
import { PlanCard } from './PlanCard';

interface PlanSidebarProps {
  plan: NightPlan | null;
  state: AgentState;
}

export function PlanSidebar({ plan, state }: PlanSidebarProps) {
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
        return "You're all set! 🎉";
      default:
        return 'Planning...';
    }
  };
  
  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">Your Night Plan</h2>
        <p className="text-sm text-primary-400 mt-1">{getStateLabel()}</p>
      </div>
      
      {/* Plan items */}
      <div className="flex-1 overflow-y-auto p-4">
        {!plan || plan.items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-gray-400 text-sm">
              Your itinerary will appear here as we plan your night!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plan.items.map((item, index) => (
              <PlanCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
      
      {/* Summary footer */}
      {plan && plan.items.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              {plan.items.length} {plan.items.length === 1 ? 'stop' : 'stops'}
            </span>
            {plan.estimatedCost && (
              <span className="text-gray-300 font-medium">
                ${plan.estimatedCost.min} - ${plan.estimatedCost.max}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
