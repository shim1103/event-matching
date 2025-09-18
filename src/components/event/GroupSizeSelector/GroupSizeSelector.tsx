import React from 'react';
import { COLORS } from '../../../utils/constants';

interface GroupSizeSelectorProps {
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
}

const GroupSizeSelector: React.FC<GroupSizeSelectorProps> = ({
  groupSize,
  onGroupSizeChange,
  minSize = 1,
  maxSize = 10
}) => {
  const handleIncrement = () => {
    if (groupSize < maxSize) {
      onGroupSizeChange(groupSize + 1);
    }
  };

  const handleDecrement = () => {
    if (groupSize > minSize) {
      onGroupSizeChange(groupSize - 1);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium" style={{ color: COLORS.TEXT }}>
        あなたのグループ人数
      </h3>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleDecrement}
          disabled={groupSize <= minSize}
          className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 text-xl font-bold
            ${groupSize <= minSize 
              ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
              : 'border-red-500 text-red-500 hover:bg-red-50'
            }
          `}
        >
          −
        </button>
        
        <div className="flex flex-col items-center">
          <span 
            className="text-3xl font-bold"
            style={{ color: COLORS.PRIMARY }}
          >
            {groupSize}
          </span>
          <span className="text-sm text-gray-500">人</span>
        </div>
        
        <button
          onClick={handleIncrement}
          disabled={groupSize >= maxSize}
          className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 text-xl font-bold
            ${groupSize >= maxSize 
              ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
              : 'border-red-500 text-red-500 hover:bg-red-50'
            }
          `}
        >
          ＋
        </button>
      </div>
    </div>
  );
};

export default GroupSizeSelector;