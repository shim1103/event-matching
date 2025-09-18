import React from 'react';
import { ACTIVITIES, COLORS } from '../../../utils/constants';

interface ActivitySelectorProps {
  selectedActivity: string;
  onActivityChange: (activity: string) => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivity,
  onActivityChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium" style={{ color: COLORS.TEXT }}>
        何をしたいですか？
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity}
            onClick={() => onActivityChange(activity)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${selectedActivity === activity 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">
                {getActivityEmoji(activity)}
              </span>
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: selectedActivity === activity ? COLORS.PRIMARY : COLORS.TEXT 
                }}
              >
                {activity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// アクティビティに対応する絵文字を返す関数
const getActivityEmoji = (activity: string): string => {
  switch (activity) {
    case 'ボードゲーム':
      return '🎲';
    case 'バレーボール':
      return '🏐';
    case 'カラオケ':
      return '🎤';
    case '映画鑑賞':
      return '🎬';
    default:
      return '🎯';
  }
};

export default ActivitySelector;