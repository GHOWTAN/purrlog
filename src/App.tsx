import React, { useState, useEffect, useMemo } from 'react';
import CatSelector from './components/CatSelector';
import ActivityLogger from './components/ActivityLogger';
import HistoryList from './components/HistoryList';
import DashboardCharts from './components/DashboardCharts';
import AIChat from './components/AIChat';
import { CatProfile, LogEntry, ActivityType } from './types';
import { DEFAULT_CATS, STORAGE_KEYS } from './constants';
import { Calendar, BarChart2, List, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// --- Helpers ---
const getStoredData = <T,>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStoredData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Main Component ---
const App = () => {
  // State
  const [cats, setCats] = useState<CatProfile[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeCatId, setActiveCatId] = useState<string>('');
  const [view, setView] = useState<'list' | 'stats' | 'chat'>('list');
  
  // Date Filtering State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Initialize Data
  useEffect(() => {
    const loadedCats = getStoredData<CatProfile[]>(STORAGE_KEYS.CATS, DEFAULT_CATS);
    const loadedLogs = getStoredData<LogEntry[]>(STORAGE_KEYS.LOGS, []);
    const lastActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_CAT);

    setCats(loadedCats);
    setLogs(loadedLogs);
    setActiveCatId(lastActive && loadedCats.find(c => c.id === lastActive) ? lastActive : loadedCats[0].id);
  }, []);

  // Persistence
  useEffect(() => {
    if (cats.length) setStoredData(STORAGE_KEYS.CATS, cats);
  }, [cats]);

  useEffect(() => {
    if (logs.length) setStoredData(STORAGE_KEYS.LOGS, logs);
  }, [logs]);

  useEffect(() => {
    if (activeCatId) localStorage.setItem(STORAGE_KEYS.ACTIVE_CAT, activeCatId);
  }, [activeCatId]);

  // Handlers
  const handleLogActivity = (type: ActivityType, notes?: string, date: Date = new Date()) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      catId: activeCatId,
      type,
      timestamp: date.getTime(),
      notes
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    // Use a simple confirm for now, but ensure logic works
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleAddCat = () => {
    const name = prompt("Enter cat's name:");
    if (name) {
      const newCat: CatProfile = {
        id: `cat_${Date.now()}`,
        name,
        avatar: `https://picsum.photos/seed/${Date.now()}/200/200`,
        colorTheme: 'from-pink-400 to-rose-500'
      };
      setCats(prev => [...prev, newCat]);
      setActiveCatId(newCat.id);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Derived State
  const filteredLogs = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return logs
      .filter(log => log.catId === activeCatId)
      .filter(log => log.timestamp >= start.getTime() && log.timestamp <= end.getTime())
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first
  }, [logs, activeCatId, selectedDate]);

  const allLogsForStats = useMemo(() => {
    return logs.filter(log => log.catId === activeCatId);
  }, [logs, activeCatId]);

  const activeCat = cats.find(c => c.id === activeCatId);
  const isToday = new Date().toDateString() === selectedDate.toDateString();

  return (
    <div className="min-h-screen bg-[#FDF8F7] max-w-md mx-auto shadow-2xl flex flex-col relative">
      
      {/* Header & Cat Selector */}
      <div className="bg-white/80 backdrop-blur-md z-30">
        <CatSelector 
            cats={cats} 
            activeCatId={activeCatId} 
            onSelectCat={setActiveCatId}
            onAddCat={handleAddCat}
        />
      </div>

      {/* Date Navigator (Only for List View) */}
      {view === 'list' && (
        <div className="flex items-center justify-between px-6 py-2 bg-white/50 border-b border-gray-100">
            <button onClick={() => changeDate(-1)} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
                <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {isToday ? 'Today' : 'History'}
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <Calendar size={14} className="text-orange-500" />
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
            <button 
                onClick={() => changeDate(1)} 
                disabled={isToday}
                className={`p-2 rounded-full transition-all ${isToday ? 'text-gray-200' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}
            >
                <ChevronRight size={20} />
            </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {view === 'list' && (
            <>
                <div className="mt-4 mb-2 px-4">
                    <h2 className="text-lg font-bold text-gray-800">Quick Log</h2>
                </div>
                <ActivityLogger onLogActivity={handleLogActivity} />
                
                <div className="mt-6 mb-2 px-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Timeline</h2>
                    <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg">
                        {filteredLogs.length} Entries
                    </span>
                </div>
                <HistoryList logs={filteredLogs} onDelete={handleDeleteLog} />
            </>
        )}
        
        {view === 'stats' && (
            <div className="pt-6">
                <div className="px-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
                    <p className="text-gray-500 text-sm">Overview of {activeCat?.name}'s habits</p>
                </div>
                <DashboardCharts logs={allLogsForStats} />
            </div>
        )}

        {view === 'chat' && (
          <AIChat activeCat={activeCat} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-around items-center sticky bottom-0 z-40 pb-8">
        <button 
            onClick={() => setView('list')}
            className={`flex flex-col items-center space-y-1 transition-colors w-16 ${view === 'list' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <List size={24} strokeWidth={view === 'list' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Journal</span>
        </button>
        
        <button 
            onClick={() => setView('chat')}
            className={`flex flex-col items-center space-y-1 transition-colors w-16 ${view === 'chat' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <div className={`p-1 rounded-xl ${view === 'chat' ? 'bg-orange-100' : 'bg-transparent'}`}>
              <Sparkles size={24} strokeWidth={view === 'chat' ? 3 : 2} className={view === 'chat' ? 'text-orange-600' : 'text-gray-400'} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide">AI Vet</span>
        </button>

        <button 
            onClick={() => setView('stats')}
            className={`flex flex-col items-center space-y-1 transition-colors w-16 ${view === 'stats' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <BarChart2 size={24} strokeWidth={view === 'stats' ? 3 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Trends</span>
        </button>
      </div>
    </div>
  );
};

export default App;
