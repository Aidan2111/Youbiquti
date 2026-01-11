// Main App component

import { Header, MessageList, InputBar, PlanSidebar } from './components';
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
  } = useChat();

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header onNewChat={startNewSession} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {error && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <MessageList messages={messages} isLoading={isLoading} />
          <InputBar onSend={sendMessage} disabled={isLoading} />
        </div>
        
        {/* Plan sidebar */}
        <PlanSidebar plan={plan} state={state} />
      </div>
    </div>
  );
}

export default App;
