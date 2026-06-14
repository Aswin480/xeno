import { useCopilotStore } from '../store/copilotStore';

export const useCopilot = () => {
  const store = useCopilotStore();
  return {
    goal: store.goal,
    setGoal: store.setGoal,
    generatedPlan: store.generatedPlan,
    setGeneratedPlan: store.setGeneratedPlan,
    generating: store.generating,
    error: store.error,
    generatePlan: store.generatePlan,
    resetPlan: store.resetPlan,
  };
};
