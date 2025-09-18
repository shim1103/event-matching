import React from 'react';
import { INTENSITY_OPTIONS, COLORS } from '../../../utils/constants';

interface IntensitySelectorProps {
  selectedIntensity: string;
  onIntensityChange: (intensity: string) => void;
}

const IntensitySelector: React.FC<IntensitySelectorProps> = ({
  selectedIntensity,
  onIntensityChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium" style={{ color: COLORS.TEXT }}>
        どう楽しみたいですか？
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {INTENSITY_OPTIONS.map((intensity) => (
          <button
            key={intensity}
            onClick={() => onIntensityChange(intensity)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${selectedIntensity === intensity 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">
                {getIntensityEmoji(intensity)}
              </span>
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: selectedIntensity === intensity ? COLORS.PRIMARY : COLORS.TEXT 
                }}
              >
                {intensity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 楽しみ方に対応する絵文字を返す関数
const getIntensityEmoji = (intensity: string): string => {
  switch (intensity) {
    case 'エンジョイ':
      return '😊';
    case 'ガチ':
      return '🔥';
    default:
      return '⚡';
  }
};

export default IntensitySelector;