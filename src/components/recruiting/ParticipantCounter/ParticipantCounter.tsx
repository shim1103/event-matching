import React from 'react';
import { COLORS } from '../../../utils/constants';

interface ParticipantCounterProps {
  currentCount: number;
  minCount: number;
  maxCount: number;
  isAnimating?: boolean;
}

const ParticipantCounter: React.FC<ParticipantCounterProps> = ({
  currentCount,
  minCount,
  maxCount,
  isAnimating = false
}) => {
  const progressPercentage = (currentCount / minCount) * 100;
  console.log('ParticipantCounter progressPercentage', progressPercentage);

  return (
    <div className="text-center space-y-4">
      {/* 参加者アイコン表示 */}
      <div className="flex flex-wrap justify-center gap-1 max-w-full">
        {Array.from({ length: maxCount }).map((_, index) => (
          <div
            key={index}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs
              transition-all duration-300 flex-shrink-0
              ${index < currentCount 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-400'
              }
              ${isAnimating && index === currentCount - 1 ? 'animate-pulse' : ''}
            `}
          >
            👤
          </div>
        ))}
      </div>

      {/* 数値表示 */}
      <div className="space-y-2">
        <div 
          className="text-2xl font-bold"
          style={{ color: COLORS.PRIMARY }}
        >
          {currentCount}人参加中
        </div>
        <div className="text-sm text-gray-500">
          開始まであと{Math.max(0, minCount - currentCount)}人
        </div>
        <div className="text-xs text-gray-400">
          最大{maxCount}人まで
        </div>
      </div>

      {/* プログレスリング */}
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              color: COLORS.PRIMARY,
              strokeDasharray: `${2 * Math.PI * 10}`,
              strokeDashoffset: `${2 * Math.PI * 10 * (1 - progressPercentage / 100)}`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-lg font-semibold"
            style={{ color: COLORS.PRIMARY }}
          >
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCounter;