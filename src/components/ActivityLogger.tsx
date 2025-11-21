import React, { useState } from 'react';
import { ACTIVITIES } from '../constants';
import { ActivityType } from '../src/types';
import { Plus, X } from 'lucide-react';

interface ActivityLoggerProps {
  onLogActivity: (type: ActivityType, notes?: string, date?: Date) => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onLogActivity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [notes, setNotes] = useState('');
  const [customTime, setCustomTime] = useState<string>(''); // ISO string format for datetime-local

  const handleQuickClick = (type: ActivityType) => {
    setSelectedActivity(type);
    setIsModalOpen(true);
    // Reset modal state
    setNotes('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setCustomTime(now.toISOString().slice(0, 16));
  };

  const handleSubmit = () => {
    if (selectedActivity) {
        const date = customTime ? new Date(customTime) : new Date();
        onLogActivity(selectedActivity, notes, date);
        setIsModalOpen(false);
        setSelectedActivity(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-3 p-4">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => handleQuickClick(activity.id)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all active:scale-95"
          >
            <div className={`w-10 h-10 rounded-full ${activity.bgColor} ${activity.color} flex items-center justify-center mb-2`}>
              {activity.icon}
            </div>
            <span className="text-xs font-medium text-gray-600">{activity.label}</span>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className={`p-4 flex items-center justify-between ${ACTIVITIES.find(a => a.id === selectedActivity)?.bgColor}`}>
              <div className="flex items-center gap-2">
                 <div className={`p-2 bg-white rounded-full ${ACTIVITIES.find(a => a.id === selectedActivity)?.color}`}>
                   {ACTIVITIES.find(a => a.id === selectedActivity)?.icon}
                 </div>
                 <h3 className="text-lg font-bold text-gray-800">
                    Log {ACTIVITIES.find(a => a.id === selectedActivity)?.label}
                 </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Time</label>
                    <input 
                        type="datetime-local" 
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-200 text-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Consistency? Amount? Mood?"
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-200 h-24 resize-none"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Save Log
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityLogger;
