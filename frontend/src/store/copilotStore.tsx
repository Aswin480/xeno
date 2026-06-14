import React, { createContext, useContext, useState, useCallback } from 'react';
import { copilotApi, CopilotPlan } from '../api/copilot';

interface CopilotStoreContextType {
  goal: string;
  setGoal: (goal: string) => void;
  generatedPlan: CopilotPlan | null;
  setGeneratedPlan: (plan: CopilotPlan | null) => void;
  generating: boolean;
  error: string | null;
  generatePlan: (goal: string) => Promise<CopilotPlan>;
  resetPlan: () => void;
}

const CopilotStoreContext = createContext<CopilotStoreContextType | undefined>(undefined);

export const CopilotStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goal, setGoal] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<CopilotPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(async (promptGoal: string) => {
    setGenerating(true);
    setError(null);
    try {
      const plan = await copilotApi.generatePlan(promptGoal);
      setGeneratedPlan(plan);
      setGoal(promptGoal);
      return plan;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate campaign plan';
      setError(errorMsg);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, []);

  const resetPlan = useCallback(() => {
    setGeneratedPlan(null);
    setError(null);
  }, []);

  return (
    <CopilotStoreContext.Provider
      value={{
        goal,
        setGoal,
        generatedPlan,
        setGeneratedPlan,
        generating,
        error,
        generatePlan,
        resetPlan,
      }}
    >
      {children}
    </CopilotStoreContext.Provider>
  );
};

export const useCopilotStore = () => {
  const context = useContext(CopilotStoreContext);
  if (context === undefined) {
    throw new Error('useCopilotStore must be used within a CopilotStoreProvider');
  }
  return context;
};
