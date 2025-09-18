import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Button from '../../components/common/Button';
import MatchingStatus from '../../components/recruiting/MatchingStatus';
import ParticipantCounter from '../../components/recruiting/ParticipantCounter';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { getCalendarDetail, getHobbyList } from '../../services/api/client';
import { CalendarDetailResponse } from '../../services/api/dto/getCalendarDetailApi-dto';
import { Hobby } from '../../services/api/dto/getHobbyListApi-dto';
import userCalendarsData from '../../dummydata/user_calendars.json';
import groupsData from '../../dummydata/groups.json';

// 型定義をCalendarDetailResponseに合わせる
type EventData = CalendarDetailResponse;

interface MatchingState {
  status: 'searching' | 'found' | 'matched';
  isAnimating: boolean;
}

// ===== API版 (将来実装) =====
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getMatchingStatus } from '../../services/api/events';

const Recruiting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(null);
  // 状態管理
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータからカレンダーIDを取得
  const searchParams = new URLSearchParams(location.search);
  const calendarId = searchParams.get('calendarId');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId || '');
    if (!userId) {
      navigate('/');
    }
  }, []);

  // 趣味一覧を取得
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await getHobbyList();
        setHobbies(response || []);
      } catch (err) {
        console.error('趣味一覧の取得に失敗しました:', err);
        // エラーの場合はダミーデータを使用
        setHobbies([
          { hobbyId: "1", name: "ボードゲーム" },
          { hobbyId: "2", name: "バレーボール" },
          { hobbyId: "3", name: "カラオケ" },
          { hobbyId: "4", name: "映画鑑賞" }
        ]);
      }
    };

    fetchHobbies();
  }, []);

  // カレンダー詳細情報を取得
  useEffect(() => {
    const fetchCalendarDetail = async () => {
      if (!calendarId) {
        setError('カレンダーIDが見つかりません');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const calendarDetail = await getCalendarDetail(userId || '1', calendarId);
        console.log('calendarDetail', calendarDetail);

        // カレンダー詳細データをeventDataとして設定
        setEventData({
          userId: calendarDetail.userId,
          hobbyId: calendarDetail.hobbyId,
          date: calendarDetail.date,
          timeSlot: calendarDetail.timeSlot,
          intensity: calendarDetail.intensity,
          mincapacity: calendarDetail.mincapacity,
          maxcapacity: calendarDetail.maxcapacity,
          attendees: calendarDetail.attendees,
          count: calendarDetail.count,
          status: calendarDetail.status,
          shops: calendarDetail.shops
        });
        console.log('eventData set calendarDetail', eventData);

      } catch (err) {
        console.error('カレンダーデータの取得に失敗しました:', err);

        // エラーの場合はダミーデータを使用
        const dummyCalendar = userCalendarsData.find(cal => cal.id.toString() === calendarId) || userCalendarsData[0];
        const dummyGroup = groupsData.find(group => group.id === dummyCalendar?.group_id) || groupsData[0];

        if (dummyCalendar && dummyGroup) {
          // ダミーデータからeventDataを設定
          setEventData({
            userId: dummyCalendar.user_id.toString(),
            hobbyId: dummyCalendar.hobby_id.toString(),
            date: dummyCalendar.date,
            timeSlot: dummyCalendar.time_slot as "morning" | "afternoon" | "evening",
            intensity: dummyCalendar.intensity as "casual" | "serious",
            mincapacity: 2,
            maxcapacity: 6,
            attendees: dummyCalendar.attendees,
            count:  0,
            status: dummyCalendar.status as "recruiting" | "matched" | "closed" | null,
            shops: [{
              name: dummyGroup.location,
              address: '東京都渋谷区'
            }]
          });
        } else {
          setError('カレンダー詳細の取得に失敗しました');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCalendarDetail();
    }
  }, [calendarId, userId, hobbies]);

  // アクティビティ名を取得する関数
  const getActivityName = (hobbyId: string): string => {
    const hobby = hobbies.find(h => h.hobbyId === hobbyId);
    return hobby ? hobby.name : 'ボードゲーム';
  };

  // 強度の日本語表示を取得する関数
  const getIntensityName = (intensity: string): string => {
    return intensity === 'serious' ? 'ガチ' : 'エンジョイ';
  };

  // マッチング状態管理
  const [matchingState, setMatchingState] = useState<MatchingState>({
    status: 'searching',
    isAnimating: false
  });

  // eventDataが更新されたときにmatchingStateも更新
  useEffect(() => {
    if (eventData) {
      setMatchingState(prev => ({
        ...prev,
        status: (eventData.count >= eventData.mincapacity) ? 'matched' : 'searching'
      }));
    }
  }, [eventData]);

  // マッチング完了時の処理
  useEffect(() => {
    if (matchingState.status === 'found') {
      const timer = setTimeout(() => {
        setMatchingState(prev => ({ ...prev, status: 'matched' }));
      }, 3000); // 3秒後にマッチング完了

      return () => clearTimeout(timer);
    }
  }, [matchingState.status]);

  // 参加者アイコンを生成する関数
  const renderParticipantGrid = () => {
    const totalSlots = 12; // 3行x4列のグリッド
    const currentParticipants = eventData?.count || 0;
    const myGroupSize = eventData?.attendees || 1; // あなたのグループ数
    const othersCount = Math.max(0, currentParticipants - myGroupSize); // 他の人の数
    
    const slots = Array.from({ length: totalSlots }, (_, index) => {
      let slotType: 'user' | 'other' | 'searching' | 'empty';
      let bgColor: string;
      let icon: string;
      
      if (index < myGroupSize) {
        // あなたのグループ（attendeesの数だけ）
        slotType = 'user';
        bgColor = 'bg-red-400';
        icon = '👤';
      } else if (index < currentParticipants) {
        // 他の参加者（count - attendees の数）
        slotType = 'other';
        bgColor = 'bg-green-500';
        icon = '👤';
      } else if (index < Math.min(currentParticipants + 3, totalSlots)) {
        // 検索中のスロット（点線ボーダー）
        slotType = 'searching';
        bgColor = 'bg-yellow-200 border-2 border-dashed border-yellow-400';
        icon = '🔍';
      } else {
        // 空のスロット
        slotType = 'empty';
        bgColor = 'bg-gray-200';
        icon = '·';
      }
      
      return (
        <div
          key={index}
          className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg ${bgColor} ${
            slotType === 'searching' ? 'animate-pulse' : ''
          }`}
        >
          {icon}
        </div>
      );
    });
    
    return (
      <div className="grid grid-cols-4 gap-2">
        {slots}
      </div>
    );
  };

  // 残り必要人数を計算
  const getRemainingNeeded = () => {
    const current = eventData?.count || 0;
    const min = eventData?.mincapacity || 2;
    return Math.max(0, min - current);
  };

  const handleCancel = () => {
    // ===== API版のキャンセル処理 (将来実装) =====
    // if (eventId) {
    //   cancelMatching(eventId).then(() => {
    //     queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    //     navigate('/dashboard');
    //   }).catch((error) => {
    //     console.error('キャンセルエラー:', error);
    //     alert('キャンセルに失敗しました');
    //   });
    // } else {
    //   navigate('/dashboard');
    // }

    // キャンセル処理（現在は画面のリロード）
    window.location.reload();
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'M月d日（E）', { locale: ja });
    } catch {
      return dateString;
    }
  };

  // ローディング状態
  if (loading) {
    return <LoadingScreen show={true} message="読み込み中..." />;
  }

  // エラー状態
  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => navigate('/dashboard')} variant="primary">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    );
  }

  // データが取得できない場合
  if (!eventData) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">イベントデータが見つかりません</div>
          <Button onClick={() => navigate('/dashboard')} variant="primary">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-4 border-2" style={{ borderColor: '#ef4444' }}>
        <div className="space-y-4">
          {/* 上部: マッチング中 + アクティビティ情報 */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                <span className="text-white font-bold text-sm">🔍</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">マッチング中</h2>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {getActivityName(eventData.hobbyId)}（{getIntensityName(eventData.intensity)}）
            </h3>
          </div>

          {/* 中央: 参加者グリッド */}
          <div>
            <div className="text-center mb-4">
              <p className="text-red-500 text-sm font-medium">メンバーを探しています...</p>
            </div>
            
            {/* 参加者グリッド */}
            <div className="mb-4">
              {renderParticipantGrid()}
            </div>

            {/* 凡例 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>あなたのグループ</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>他の人</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-200 border-2 border-dashed border-yellow-400 rounded"></div>
                <span>募集中</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>上限枠</span>
              </div>
            </div>
          </div>

          {/* 下部: 参加状況 */}
          <div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-red-600">{eventData.count}人参加中</h3>
              <p className="text-sm text-gray-600">
                最低{eventData.mincapacity}人必要・最大{eventData.maxcapacity}人
              </p>
              {getRemainingNeeded() > 0 ? (
                <p className="text-lg font-semibold text-gray-800">
                  あと{getRemainingNeeded()}人でイベント開催できます
                </p>
              ) : (
                <p className="text-lg font-semibold text-green-600">
                  イベント開催可能です！
                </p>
              )}
            </div>
          </div>

          {/* 戻るボタン */}
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiting;