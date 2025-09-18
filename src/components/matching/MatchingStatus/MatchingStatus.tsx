import React from 'react';
import { COLORS } from '../../../utils/constants';

interface MatchingStatusProps {
  eventData: {
    date: string;
    activity: string;
    intensity: string;
    totalCapacity: string;
  };
  currentParticipants: number;
  minParticipants: number;
  status: 'searching' | 'found' | 'matched';
}

const MatchingStatus: React.FC<MatchingStatusProps> = ({
  eventData,
  currentParticipants,
  minParticipants,
  status
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'searching':
        return 'メンバーを探しています...';
      case 'found':
        return 'マッチングが見つかりました！';
      case 'matched':
        return 'マッチング完了！';
      default:
        return 'マッチング中...';
    }
  };

  const getStatusEmoji = () => {
    switch (status) {
      case 'searching':
        return '🔍';
      case 'found':
        return '✨';
      case 'matched':
        return '🎉';
      default:
        return '⏳';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((currentParticipants / minParticipants) * 100, 100);
  };

  return (
    <div className="space-y-4">
      {/* イベント詳細表示 */}
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold" style={{ color: COLORS.TEXT }}>
          {eventData.activity} ({eventData.intensity})
        </div>
        <div className="text-sm text-gray-500">
          {eventData.date}
        </div>
        <div className="text-sm text-gray-500">
          希望参加人数: {eventData.totalCapacity}
        </div>
      </div>

      {/* ステータス表示 */}
      <div className="text-center space-y-3">
        <div className="text-4xl animate-bounce">
          {getStatusEmoji()}
        </div>
        <div 
          className="text-lg font-medium"
          style={{ color: COLORS.PRIMARY }}
        >
          {getStatusText()}
        </div>
      </div>

      {/* プログレスバー */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>現在の参加者</span>
          <span>{currentParticipants}/{minParticipants}人</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              backgroundColor: COLORS.PRIMARY,
              width: `${getProgressPercentage()}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingStatus;