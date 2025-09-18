import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Button from '../../components/common/Button';
import EventSummary from '../../components/event/EventSummary';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import venuesData from '../../dummydata/venues.json';
import groupsData from '../../dummydata/groups.json';
import userCalendarsData from '../../dummydata/user_calendars.json';
import { getCalendarDetail } from '../../services/api/client';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 状態管理
  const [userId, setUserId] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
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

        console.log('Proposal calendarId', calendarId);
        const calendarDetail = await getCalendarDetail(userId || '', calendarId);
        console.log('Proposal calendarDetail', calendarDetail);

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

        // マッチング結果を設定
        setMatchingResult({
          currentParticipants: calendarDetail.attendees || 0,
          maxParticipants: calendarDetail.maxcapacity || 10
        });

        // 会場データを設定（ダミーデータ）
        // setAllVenues(venuesData);

      } catch (err) {
        console.error('カレンダー詳細の取得に失敗しました:', err);

        // エラーの場合はダミーデータを使用
        const dummyCalendar = userCalendarsData.find(cal => cal.id.toString() === calendarId);
        const dummyGroup = groupsData.find(group => group.id === dummyCalendar?.group_id);

        if (dummyCalendar && dummyGroup) {
          // ダミーデータからeventDataを設定
          setEventData({
            userId: dummyCalendar.user_id.toString(),
            hobbyId: dummyCalendar.hobby_id.toString(),
            date: dummyCalendar.date,
            timeSlot: dummyCalendar.time_slot,
            intensity: dummyCalendar.intensity,
            mincapacity: 2,
            maxcapacity: 6,
            attendees: dummyCalendar.attendees,
            status: dummyCalendar.status,
            shops: [{
              name: dummyGroup.location,
              address: '東京都渋谷区'
            }]
          });

          // マッチング結果を設定
          setMatchingResult({
            currentParticipants: dummyCalendar.attendees,
            maxParticipants: 6
          });

          // 会場データを設定
          setAllVenues(venuesData);
        } else {
          setError('カレンダー詳細の取得に失敗しました');
        }
      } finally {
        setLoading(false);
      }
    };

    if(userId) {
      fetchCalendarDetail();
    }
  }, [calendarId, userId]);

  // 日付フォーマット関数
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'M月d日(E)', { locale: ja });
    } catch {
      return dateString;
    }
  };

  // 会場選択ハンドラー
  const handleVenueSelect = (venue: any) => {
    setSelectedVenue(venue);
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
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                <span className="text-white font-bold text-sm">💡</span>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">アプリからの提案</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 px-2 py-1 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
              ✨ あなたにぴったりの場所を見つけました！
            </p>

            <form className="space-y-3">
              {/* イベントサマリー */}
              <div>
                <EventSummary
                  eventData={{
                    ...eventData,
                    date: formatEventDate(eventData.date)
                  }}
                  participantCount={eventData.count}
                />
              </div>

              {/* 会場リスト */}
              {/* {allVenues.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-1">📍 会場リスト</h3>
                  <div className="space-y-1">
                    {allVenues.map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        onSelect={() => handleVenueSelect(venue)}
                      />
                    ))}
                  </div>
                </div>
              )} */}

              {/* 選択された場所の表示 */}
              {selectedVenue && (
                <div>
                  <div className="border-2 border-red-500 rounded-lg p-2 text-center bg-red-50">
                    <div className="text-xs font-medium text-red-600 mb-1">
                      選択中の場所
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {selectedVenue.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedVenue.address}
                    </div>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="space-y-1">
                {/* <button
                  // onClick={handleParticipate}
                  type="button"
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedVenue}
                >
                  参加する
                </button> */}

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  戻る
                </button>
              </div>

              {/* 注意事項 */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
                <div className="text-xs text-red-800 space-y-1">
                  <p className="flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>参加確定後のキャンセルはできません</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>場所の予約は各自で行ってください</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <span>📞</span>
                    <span>当日の連絡先は後日お知らせします</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Proposal;