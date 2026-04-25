import { MessageSquare, Clock, Zap } from 'lucide-react';

export default function RecentChats({ session, loading }) {
  if (loading) {
    return (
      <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="shimmer-bg h-4 w-32 rounded mb-4" />
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="shimmer-bg h-8 w-8 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="shimmer-bg h-3 w-3/4 rounded mb-1" />
              <div className="shimmer-bg h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mock recent chats - in production, these would come from your actual chat history
  const mockChats = [
    {
      id: 1,
      title: 'TokenLens UI Redesign',
      timestamp: new Date(Date.now() - 15 * 60000),
      tokens: 12400,
      model: 'claude-sonnet-4-6',
      messages: 8,
    },
    {
      id: 2,
      title: 'API Rate Limiting Strategy',
      timestamp: new Date(Date.now() - 2 * 3600000),
      tokens: 8900,
      model: 'claude-opus-4-7',
      messages: 12,
    },
    {
      id: 3,
      title: 'Data Processing Pipeline',
      timestamp: new Date(Date.now() - 1 * 86400000),
      tokens: 15600,
      model: 'claude-sonnet-4-6',
      messages: 6,
    },
    {
      id: 4,
      title: 'Database Optimization',
      timestamp: new Date(Date.now() - 2 * 86400000),
      tokens: 9200,
      model: 'claude-haiku-4-5',
      messages: 4,
    },
  ];

  function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  const getModelColor = (model) => {
    const colors = {
      'claude-opus-4-7': { bg: '#FFD6E0', text: '#FF6B9D' },
      'claude-sonnet-4-6': { bg: '#C3E8FF', text: '#0098FF' },
      'claude-haiku-4-5': { bg: '#C6F6E8', text: '#00C48C' },
    };
    return colors[model] || { bg: '#F0F2F7', text: '#6B7A99' };
  };

  return (
    <div className="card-solid rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1A1E2E]">Recent Chats</p>
          <p className="text-xs text-muted mt-0.5">Recent conversations</p>
        </div>
        <MessageSquare size={16} className="text-[#7C5CFC]" />
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[400px] pr-1 custom-scroll">
        {mockChats.map((chat, i) => {
          const modelColor = getModelColor(chat.model);

          return (
            <div
              key={chat.id}
              className="group p-3 rounded-2xl hover:bg-[#F8F9FC] transition-all duration-200 border border-border/40 hover:border-[#7C5CFC]/30 cursor-pointer animate-fade-in"
              style={{
                animationDelay: `${i * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1E2E] truncate group-hover:text-[#7C5CFC] transition-colors">
                    {chat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: modelColor.bg, color: modelColor.text }}
                    >
                      {chat.model.split('-')[1]}
                    </span>
                    <span className="text-[10px] text-muted flex items-center gap-0.5">
                      <MessageSquare size={10} />
                      {chat.messages}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                <span className="text-[10px] text-muted flex items-center gap-1">
                  <Clock size={10} />
                  {formatTime(chat.timestamp)}
                </span>
                <span className="text-[10px] font-mono text-[#7C5CFC] font-semibold flex items-center gap-0.5">
                  <Zap size={10} />
                  {(chat.tokens / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-muted mt-4 pt-3 border-t border-border/50">
        View more in chat history
      </p>
    </div>
  );
}
