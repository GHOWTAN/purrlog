import React from 'react';
import { LogEntry } from '../src/types';
import { ACTIVITIES } from '../constants';
import { Clock, Trash2 } from 'lucide-react';

interface HistoryListProps {
  logs: LogEntry[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Clock size={24} />
        </div>
        <p className="text-sm">No activity recorded for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 pb-20">
      {logs.map((log) => {
        const config = ACTIVITIES.find(a => a.id === log.type);
        const date = new Date(log.timestamp);
        
        return (
          <div 
            key={log.id} 
            className="group flex items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Icon Box */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config?.bgColor} ${config?.color} flex items-center justify-center`}>
              {config?.icon}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">{config?.label}</h4>
                <span className="text-xs font-medium text-gray-400">
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {log.notes && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{log.notes}</p>
              )}
            </div>

            {/* Actions */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(log.id);
              }}
              className="ml-2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-100 transition-all active:bg-red-100 active:text-red-600"
              title="Delete entry"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
