import React from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary/30">
      {/* Sidebar - Fix position */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <LandingPage />
      </main>
    </div>
  );
}

export default App;
