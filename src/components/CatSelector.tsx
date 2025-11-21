import React from 'react';
import { Plus, Check } from 'lucide-react';
import { CatProfile } from '../src/types';
import { DEFAULT_CATS } from '../constants';

interface CatSelectorProps {
  cats: CatProfile[];
  activeCatId: string;
  onSelectCat: (id: string) => void;
  onAddCat: () => void;
}

const CatSelector: React.FC<CatSelectorProps> = ({ cats, activeCatId, onSelectCat, onAddCat }) => {
  return (
    <div className="flex overflow-x-auto py-4 px-4 space-x-4 no-scrollbar items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100">
      {cats.map((cat) => {
        const isActive = cat.id === activeCatId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCat(cat.id)}
            className={`relative flex flex-col items-center space-y-1 transition-all duration-300 ${
              isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-60 hover:opacity-80'
            }`}
          >
            <div className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-br ${cat.colorTheme} shadow-lg`}>
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img 
                  src={cat.avatar} 
                  alt={cat.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <span className={`text-xs font-bold ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
              {cat.name}
            </span>
            {isActive && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm border border-white">
                <Check size={10} strokeWidth={4} />
              </div>
            )}
          </button>
        );
      })}
      
      <button
        onClick={onAddCat}
        className="flex flex-col items-center justify-center space-y-1 group"
      >
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
          <Plus size={24} className="text-gray-400" />
        </div>
        <span className="text-xs text-gray-400 font-medium">Add</span>
      </button>
    </div>
  );
};

export default CatSelector;
