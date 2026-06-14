import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import CopilotPage from './routes/CopilotPage';
import CampaignReviewPage from './routes/CampaignReviewPage';
import CampaignMonitorPage from './routes/CampaignMonitorPage';
import CampaignHistoryPage from './routes/CampaignHistoryPage';
import InsightsPage from './routes/InsightsPage';
import CustomersPage from './routes/CustomersPage';
import CustomerDetailPage from './routes/CustomerDetailPage';
import { CampaignStoreProvider } from './store/campaignStore';
import { CopilotStoreProvider } from './store/copilotStore';
import { getTheme, applyTheme } from './utils/theme';

export const App: React.FC = () => {
  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CampaignStoreProvider>
        <CopilotStoreProvider>
          <div className="min-h-screen bg-background text-text-primary flex">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Layout Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen pl-64">
              {/* Topbar Header */}
              <Topbar />

              <main className="flex-1 overflow-y-auto px-8 pt-20 pb-12">
                <div className="w-full">
                  <Routes>
                    <Route path="/" element={<div className="max-w-6xl mx-auto"><CopilotPage /></div>} />
                    <Route path="/campaigns" element={<div className="max-w-6xl mx-auto"><CampaignHistoryPage /></div>} />
                    <Route path="/campaigns/review" element={<div className="max-w-6xl mx-auto"><CampaignReviewPage /></div>} />
                    <Route path="/campaigns/monitor/:id" element={<div className="max-w-6xl mx-auto"><CampaignMonitorPage /></div>} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/customers" element={<div className="max-w-6xl mx-auto"><CustomersPage /></div>} />
                    <Route path="/customers/:id" element={<div className="max-w-6xl mx-auto"><CustomerDetailPage /></div>} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </CopilotStoreProvider>
      </CampaignStoreProvider>
    </BrowserRouter>
  );
};
export default App;
