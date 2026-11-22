import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppearanceDrawer } from '@/components/AppearanceDrawer';
import { AuthModal } from '@/components/AuthModal';

import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ReaderPage } from '@/pages/ReaderPage';
import { WritingStudioPage } from '@/pages/WritingStudioPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { DashboardPage } from '@/pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary transition-colors">
              <Navbar />
              
              <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/stories" element={<CategoryPage category="stories" />} />
                  <Route path="/articles" element={<CategoryPage category="articles" />} />
                  <Route path="/letters" element={<CategoryPage category="letters" />} />
                  <Route path="/emails" element={<CategoryPage category="emails" />} />
                  <Route path="/reader/:id" element={<ReaderPage />} />
                  <Route path="/studio" element={<WritingStudioPage />} />
                  <Route path="/studio/:id" element={<WritingStudioPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </main>

              <Footer />
              
              {/* Global Modals & Drawers */}
              <AppearanceDrawer />
              <AuthModal />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
