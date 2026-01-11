// Header component

interface HeaderProps {
  onNewChat: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-700 bg-gray-900 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌙</span>
        <div>
          <h1 className="font-bold text-lg text-gray-100">Girls' Night Out</h1>
          <p className="text-xs text-gray-400">Dallas Edition</p>
        </div>
      </div>
      
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Plan
      </button>
    </header>
  );
}
