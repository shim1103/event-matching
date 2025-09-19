import React from 'react';
import { COLORS } from '../../../utils/constants';

interface EventSummaryProps {
  eventData: {
    userId: string;
    hobbyId: string;
    date: string;
    timeSlot: string;
    intensity: string;
    mincapacity: number;
    maxcapacity: number;
    attendees: number;
    count: number;
    status: string;
    shops: Array<{
      name: string;
      address: string;
    }>;
    // UI表示用の追加プロパティ
    title?: string;
    time?: string;
    location?: string;
    description?: string;
    maxParticipants?: number;
    currentParticipants?: number;
  };
  participantCount: number;
}

const EventSummary: React.FC<EventSummaryProps> = ({
  eventData,
  participantCount
}) => {
  const getActivityEmoji = (hobbyId: string): string => {
    switch (hobbyId) {
      case "1":
        return '🎲'; // ボードゲーム
      case "2":
        return '🏐'; // バレーボール
      case "3":
        return '🎤'; // カラオケ
      case "4":
        return '🎬'; // 映画鑑賞
      default:
        return '🎯';
    }
  };

  const getActivityName = (hobbyId: string): string => {
    switch (hobbyId) {
      case "1":
        return 'ボードゲーム';
      case "2":
        return 'バレーボール';
      case "3":
        return 'カラオケ';
      case "4":
        return '映画鑑賞';
      default:
        return 'イベント';
    }
  };

  const getIntensityEmoji = (intensity: string): string => {
    switch (intensity) {
      case 'casual':
        return '😊';
      case 'serious':
        return '🔥';
      case 'ガチ':
        return '🔥';
      case 'エンジョイ':
        return '😊';
      default:
        return '⚡';
    }
  };

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

  const getTimeSlotName = (timeSlot: string): string => {
    switch (timeSlot) {
      case 'morning':
        return '午前';
      case 'afternoon':
        return '午後';
      default:
        return timeSlot;
    }
  };

  return (
    <div className="space-y-2">
      {/* イベント情報 */}
      <div className="">
        <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getActivityEmoji(eventData.hobbyId)}</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                {getActivityName(eventData.hobbyId)}
              </div>
              <div className="text-xs text-gray-500">アクティビティ</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getIntensityEmoji(eventData.intensity)}</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                {getIntensityName(eventData.intensity)}
              </div>
              <div className="text-xs text-gray-500">楽しみ方</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📅</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                {eventData.date}
              </div>
              <div className="text-xs text-gray-500">開催日</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🕐</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                {getTimeSlotName(eventData.timeSlot)}
              </div>
              <div className="text-xs text-gray-500">時間帯</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">👥</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                {eventData.count}人参加予定
              </div>
              <div className="text-xs text-gray-500">
                （{eventData.attendees}人あなたのグループ）
              </div>
              <div className="text-xs text-gray-500">
                定員: {eventData.mincapacity}〜{eventData.maxcapacity}人
              </div>
            </div>
          </div>
        </div>

        {/* {eventData.shops.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-semibold" style={{ color: COLORS.TEXT }}>
                  {eventData.shops[0].name}
                </div>
                <div className="text-sm text-gray-500">
                  {eventData.shops[0].address}
                </div>
              </div>
            </div>
          </div>
        )} */}

        {eventData.shops.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold mb-1">📍 会場リスト</h3>
            {eventData.shops.map((shop) => {
              return <div className="space-y-1">
                <div>
                  <div className="font-semibold text-sm" style={{ color: COLORS.TEXT }}>
                    {shop.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {shop.address}
                  </div>
                </div>
              </div>
            })}
          </div>
        )}
        
      </div>
    </div >
  );
};

export default EventSummary;