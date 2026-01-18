// Main App component with mobile-responsive layout

import { useState } from 'react';
import { Header, MessageList, InputBar, PlanSidebar, PlanToggleButton } from './components';
import { useChat } from './hooks';

function App() {
  const {
    messages,
    plan,
    state,
    isLoading,
    error,
    sendMessage,
    startNewSession,
    confirmPlanItem,
    removePlanItem,
  } = useChat();

  // Mobile drawer state
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header onNewChat={startNewSession} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {error && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-red-400 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="text-xs underline hover:no-underline"
              >
                Refresh
              </button>
            </div>
          )}

          <MessageList messages={messages} isLoading={isLoading} />
          <InputBar onSend={sendMessage} disabled={isLoading} />
        </div>

        {/* Plan sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <PlanSidebar
            plan={plan}
            state={state}
            onConfirmItem={confirmPlanItem}
            onRemoveItem={removePlanItem}
          />
        </div>

        {/* Mobile plan drawer */}
        <div className="lg:hidden">
          <PlanSidebar
            plan={plan}
            state={state}
            isOpen={isPlanOpen}
            onClose={() => setIsPlanOpen(false)}
            onConfirmItem={confirmPlanItem}
            onRemoveItem={removePlanItem}
          />
        </div>
      </div>

      {/* Mobile plan toggle button */}
      <PlanToggleButton
        onClick={() => setIsPlanOpen(true)}
        planCount={plan?.items.length ?? 0}
      />
    </div>
  );
}

export default App;
