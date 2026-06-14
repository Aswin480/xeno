import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GoalInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const GoalInput: React.FC<GoalInputProps> = ({ value, onChange, onSubmit, loading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center space-x-2.5 mb-3">
        <Sparkles className="w-5 h-5 text-primary animate-pulse-subtle" />
        <h3 className="text-sm font-semibold text-text-primary">What is your campaign goal?</h3>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E.g., Recover abandoned carts for high-value customers with a 10% coupon..."
          className="w-full min-h-[100px] pr-20 p-4 rounded-lg bg-background border border-border text-text-primary text-sm placeholder-text-muted focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:outline-none resize-none transition-all"
          disabled={loading}
        />
        <div className="absolute right-3 bottom-4">
          <button
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-border disabled:text-text-muted text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
      <p className="text-[10px] text-text-muted mt-2">
        ProTip: Mention your audience (e.g. VIP, Cart Abandoners) or channels (e.g. SMS, Email) to guide the AI model.
      </p>
    </div>
  );
};
export default GoalInput;
