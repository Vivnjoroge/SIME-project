import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './pages/LandingPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import { useSocialData } from './hooks/useSocialData';

function App() {
  const {
    filteredData,
    isLoading,
    filters,
    processFile,
    updateFilters,
    resetFilters,
    rawData
  } = useSocialData();

  return (
    <div className="flex flex-col h-screen w-full bg-[#050a14] text-text-primary overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          isDataLoaded={!!rawData}
          onFileProcessed={processFile}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          {!rawData ? (
            <LandingPage onFileProcessed={processFile} isLoading={isLoading} />
          ) : (
            <AnalysisDashboard data={filteredData!} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
