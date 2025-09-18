import React from 'react';
import { COLORS } from '../../../utils/constants';
import { CalendarDetailResponse } from '../../../services/api/dto/getCalendarDetailApi-dto';
import { Hobby } from '../../../services/api/dto/getHobbyListApi-dto';

interface MatchingStatusProps {
  eventData: CalendarDetailResponse;
  currentParticipants: number;
  minParticipants: number;
  status: 'searching' | 'found' | 'matched';
  hobbies?: Hobby[];
}

const MatchingStatus: React.FC<MatchingStatusProps> = ({
  eventData,
  currentParticipants,
  minParticipants,
  status,
  hobbies = []
}) => {
  // アクティビティ名を取得する関数
  const getActivityName = (hobbyId: string): string => {
    const hobby = hobbies.find(h => h.hobbyId === hobbyId);
    return hobby ? hobby.name : 'ボードゲーム';
  };

  // 強度を日本語に変換
  const getIntensityName = (intensity: string): string => {
    switch (intensity) {
      case 'casual':
        return 'エンジョイ';
      case 'serious':
        return 'ガチ';
      default:
        return intensity;
    }
  };
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
          {getActivityName(eventData.hobbyId)} ({getIntensityName(eventData.intensity)})
        </div>
        <div className="flex gap-2 items-center justify-center">
          <div className="text-sm text-gray-500">
            {eventData.date}
          </div>
          <div className="text-sm text-gray-500">
            希望参加人数: {eventData.mincapacity}-{eventData.maxcapacity}人
          </div>
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