import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { LogEntry } from '../src/types';
import { ACTIVITIES } from '../constants';

interface DashboardChartsProps {
  logs: LogEntry[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ logs }) => {
  // Prepare data for Bar Chart (Frequency by Type)
  const frequencyData = ACTIVITIES.map(activity => {
    return {
      name: activity.label,
      count: logs.filter(log => log.type === activity.id).length,
      color: activity.color.replace('text-', 'fill-') // Hacky but works for demo if we map tailwind colors or use hex
    };
  }).filter(d => d.count > 0);

  // Prepare data for Pie Chart
  const pieData = frequencyData;

  // Helper to get HEX color from Tailwind class approximation (Real app would use a mapping)
  const getColor = (typeId: string) => {
    switch(typeId) {
        case 'pee': return '#3B82F6';
        case 'poop': return '#B45309';
        case 'food': return '#F97316';
        case 'water': return '#06B6D4';
        case 'play': return '#A855F7';
        case 'sleep': return '#6366F1';
        case 'meds': return '#EF4444';
        case 'groom': return '#EC4899';
        default: return '#9CA3AF';
    }
  };

  if (logs.length === 0) {
    return (
        <div className="p-8 text-center text-gray-400 bg-white rounded-3xl mx-4 shadow-sm">
            Log some data to see charts!
        </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Events</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Most Frequent</p>
            <p className="text-xl font-bold text-gray-800 mt-2 truncate">
                {frequencyData.sort((a,b) => b.count - a.count)[0]?.name || '-'}
            </p>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="bg-white p-4 mx-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Activity Breakdown</h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip 
                        cursor={{fill: '#f9fafb'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={30}>
                        {frequencyData.map((entry, index) => {
                            const typeId = ACTIVITIES.find(a => a.label === entry.name)?.id || '';
                            return <Cell key={`cell-${index}`} fill={getColor(typeId)} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

       {/* Distribution */}
       <div className="bg-white p-4 mx-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Distribution</h3>
        <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                    >
                        {pieData.map((entry, index) => {
                             const typeId = ACTIVITIES.find(a => a.label === entry.name)?.id || '';
                             return <Cell key={`cell-${index}`} fill={getColor(typeId)} />;
                        })}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px'}} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
