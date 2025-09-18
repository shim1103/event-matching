import React from 'react';
import { CAPACITY_OPTIONS, COLORS } from '../../../utils/constants';

interface CapacitySelectorProps {
  selectedCapacity: string;
  onCapacityChange: (capacity: string) => void;
}

const CapacitySelector: React.FC<CapacitySelectorProps> = ({
  selectedCapacity,
  onCapacityChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium" style={{ color: COLORS.TEXT }}>
        最終的な合計人数
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {CAPACITY_OPTIONS.map((capacity) => (
          <button
            key={capacity}
            onClick={() => onCapacityChange(capacity)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${selectedCapacity === capacity 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">
                {getCapacityEmoji(capacity)}
              </span>
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: selectedCapacity === capacity ? COLORS.PRIMARY : COLORS.TEXT 
                }}
              >
                {capacity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 人数に対応する絵文字を返す関数
const getCapacityEmoji = (capacity: string): string => {
  switch (capacity) {
    case '4-6人':
      return '👥';
    case '8-12人':
      return '👫';
    default:
      return '👫';
  }
};

export default CapacitySelector;