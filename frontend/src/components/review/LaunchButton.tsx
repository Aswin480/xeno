import React, { useState } from 'react';
import { Rocket, Loader2, AlertCircle } from 'lucide-react';

interface LaunchButtonProps {
  onLaunch: () => Promise<void>;
  disabled: boolean;
  loading: boolean;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({ onLaunch, disabled, loading }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLaunchClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLaunch = async () => {
    setConfirmOpen(false);
    await onLaunch();
  };

  return (
    <div className="relative">
      {!confirmOpen ? (
        <button
          onClick={handleLaunchClick}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-border/60 disabled:text-text-muted text-white text-sm font-bold rounded-lg shadow-sm cursor-pointer disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Launching Dispatch...</span>
            </>
          ) : (
            <>
              <Rocket className="w-4.5 h-4.5" />
              <span>Approve & Launch Campaign</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-md">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold text-text-primary">Confirm Campaign Launch?</p>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                This will resolve the target segment, compile message templates, and start immediate dispatch to the Channel Simulator. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 justify-end">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-3 py-1.5 border border-border hover:bg-background hover:text-text-primary rounded-md text-[10px] font-bold text-text-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLaunch}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-md text-[10px] font-bold shadow-sm cursor-pointer"
            >
              Confirm & Launch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default LaunchButton;
