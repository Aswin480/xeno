import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Brain } from 'lucide-react';

export interface ThinkingStep {
  name: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  reasoning?: string[];
  output?: string;
}

interface CopilotThinkingProps {
  steps: ThinkingStep[];
  isThinking: boolean;
}

export const CopilotThinking: React.FC<CopilotThinkingProps> = ({ steps, isThinking }) => {
  const stepLabels: Record<string, string> = {
    parseIntent: 'Understanding your goal',
    identifySegment: 'Finding the right audience',
    analyzeHistoricalPerformance: 'Analyzing past campaigns',
    selectBestChannel: 'Evaluating channels',
    selectMessage: 'Crafting message',
    buildRecommendation: 'Finalizing plan',
  };

  return (
    <div className="space-y-4 py-6 border-l-2 border-border pl-6 relative">
      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex items-center space-x-2 text-primary text-xs font-semibold mb-4">
          <Brain className="w-4 h-4 animate-pulse" />
          <span>🧠 Copilot thinking...</span>
        </div>
      )}

      {/* Step visualization */}
      {steps.map((step, idx) => (
        <div key={step.name} className="relative">
          {/* Connection line */}
          {idx < steps.length - 1 && (
            <div className="absolute -left-[1.625rem] top-8 w-0.5 h-6 bg-border"></div>
          )}

          {/* Step bubble */}
          <div className="flex items-start space-x-3">
            {/* Status indicator */}
            <div className="mt-0.5 flex-shrink-0">
              {step.status === 'complete' && (
                <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
              )}
              {step.status === 'loading' && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
              {step.status === 'pending' && (
                <div className="w-5 h-5 rounded-full border-2 border-border bg-background"></div>
              )}
              {step.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-accent-rose" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-primary">
                {stepLabels[step.name] || step.name}
              </div>

              {/* Reasoning display */}
              {step.reasoning && step.reasoning.length > 0 && (
                <div className="mt-1.5 text-xs text-text-secondary space-y-1">
                   {step.reasoning.map((reason, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Output display */}
              {step.output && (
                <div className="mt-2 text-xs bg-primary/10 border border-primary/20 rounded px-2 py-1.5 text-text-primary">
                  {step.output}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CopilotThinking;
