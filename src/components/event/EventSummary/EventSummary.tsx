import React from 'react';
import { COLORS } from '../../../utils/constants';

interface EventSummaryProps {
  eventData: {
    date: string;
    activity: string;
    intensity: string;
    totalCapacity: string;
  };
  participantCount: number;
}

const EventSummary: React.FC<EventSummaryProps> = ({
  eventData,
  participantCount
}) => {
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

  return (
    <div className="space-y-4">
      {/* タイトル */}
      <div className="text-center">
        <h2 
          className="text-xl font-bold"
          style={{ color: COLORS.PRIMARY }}
        >
          イベント詳細
        </h2>
      </div>

      {/* イベント情報 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getActivityEmoji(eventData.activity)}</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.TEXT }}>
                {eventData.activity}
              </div>
              <div className="text-sm text-gray-500">アクティビティ</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getIntensityEmoji(eventData.intensity)}</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.TEXT }}>
                {eventData.intensity}
              </div>
              <div className="text-sm text-gray-500">楽しみ方</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.TEXT }}>
                {eventData.date}
              </div>
              <div className="text-sm text-gray-500">開催日</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-semibold" style={{ color: COLORS.TEXT }}>
                {participantCount}人参加予定
              </div>
              <div className="text-sm text-gray-500">
                希望人数: {eventData.totalCapacity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummary;