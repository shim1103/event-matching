import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import EventSummary from '../../components/event/EventSummary';
import venuesData from '../../dummydata/venues.json';
import groupsData from '../../dummydata/groups.json';
import userCalendarsData from '../../dummydata/user_calendars.json';
import { getCalendarDetail } from '../../services/api/client';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 固定のユーザーID
  let userId = localStorage.getItem('userId');
  if (!userId) {
    navigate('/');
  }
  userId = userId || '1';
  
  // 状態管理
  const [eventData, setEventData] = useState<any>(null);
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータからカレンダーIDを取得
  const searchParams = new URLSearchParams(location.search);
  const calendarId = searchParams.get('calendarId');

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
        const calendarDetail = await getCalendarDetail(userId, calendarId);
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

    fetchCalendarDetail();
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

  // // 参加ハンドラー
  // const handleParticipate = () => {
  //   if (selectedVenue) {
  //     // 参加処理を実装
  //     console.log('参加確定:', selectedVenue);
  //     // ここでAPIを呼び出して参加を確定
  //   }
  // };

  // // 辞退ハンドラー
  // const handleDecline = () => {
  //   // 辞退処理を実装
  //   console.log('辞退');
  //   navigate('/dashboard');
  // };

  // ローディング状態
  if (loading) {
    return (
      <Layout>
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-8">
            <div className="text-lg">読み込み中...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Layout>
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => navigate('/dashboard')} variant="primary">
              ダッシュボードに戻る
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // データが取得できない場合
  if (!eventData) {
    return (
      <Layout>
        <div className="max-w-md mx-auto p-4">
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">イベントデータが見つかりません</div>
            <Button onClick={() => navigate('/dashboard')} variant="primary">
              ダッシュボードに戻る
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-3">アプリからの提案</h2>
            <p className="text-xs text-gray-500 mb-3">
              あなたにぴったりの場所を見つけました！
            </p>

            <form className="space-y-3">
              {/* イベントサマリー */}
              <div>
                <EventSummary
                  eventData={{
                    ...eventData,
                    date: formatEventDate(eventData.date)
                  }}
                  participantCount={eventData.attendees}
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
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-xs hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
              </div>

              {/* 注意事項 */}
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-600 space-y-1">
                  <p>・参加確定後のキャンセルはできません</p>
                  <p>・場所の予約は各自で行ってください</p>
                  <p>・当日の連絡先は後日お知らせします</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proposal;