import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import VenueCard from '../../components/venue/VenueCard';
import EventSummary from '../../components/event/EventSummary';
import { COLORS } from '../../utils/constants';
import venuesData from '../../dummydata/venues.json';
import groupsData from '../../dummydata/groups.json';
import userCalendarsData from '../../dummydata/user_calendars.json';
import { getCalendarDetail } from '../../services/api/client';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 固定のユーザーID
  const userId = "1";
  
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
        
        const calendarDetail = await getCalendarDetail(userId, calendarId);
        
        // カレンダー詳細データをeventDataとして設定
        setEventData({
          userId: calendarDetail.userId,
          hobbyId: calendarDetail.hobbyId,
          date: calendarDetail.date,
          timeSlot: calendarDetail.timeSlot,
          intensity: calendarDetail.intensity,
          mincapacity: calendarDetail.mincapacity,
          maxcapacity: calendarDetail.maxcapacity,
          attendees: calendarDetail.capacity,
          status: calendarDetail.status,
          shops: calendarDetail.shops
        });

        // マッチング結果を設定
        setMatchingResult({
          currentParticipants: calendarDetail.capacity || 0,
          maxParticipants: calendarDetail.maxcapacity || 10
        });

        // 会場データを設定（ダミーデータ）
        setAllVenues(venuesData);

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
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* タイトル */}
        <div className="text-center">
          <h1 
            className="text-xl font-bold"
            style={{ color: COLORS.TEXT }}
          >
            アプリからの提案
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            あなたにぴったりの場所を見つけました！
          </p>
        </div>

        {/* イベントサマリー */}
        <Card>
          <EventSummary
            eventData={{
              ...eventData,
              date: formatEventDate(eventData.date)
            }}
            participantCount={eventData.attendees}
          />
        </Card>

        {/* 会場リスト */}
        {allVenues.length > 0 && (
          <div className="space-y-3">
            <h2 
              className="text-lg font-semibold"
              style={{ color: COLORS.TEXT }}
            >
              📍 会場リスト
            </h2>
            <div className="space-y-3">
              {allVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onSelect={() => handleVenueSelect(venue)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 選択された場所の表示 */}
        {selectedVenue && (
          <Card padding="medium" className="border-2 border-red-500">
            <div className="text-center space-y-2">
              <div 
                className="text-sm font-medium"
                style={{ color: COLORS.PRIMARY }}
              >
                選択中の場所
              </div>
              <div className="text-lg font-semibold" style={{ color: COLORS.TEXT }}>
                {selectedVenue.name}
              </div>
              <div className="text-sm text-gray-500">
                {selectedVenue.address}
              </div>
            </div>
          </Card>
        )}

        {/* アクションボタン */}
        <div className="space-y-3">
          {/* <Button
            // onClick={handleParticipate}
            variant="primary"
            size="large"
            fullWidth
            disabled={!selectedVenue}
            disabled={!selectedVenue || confirmParticipationMutation.isPending} // API版
          >
            {confirmParticipationMutation.isPending ? '確定中...' : '参加する'} // API版
            参加する
          </Button> */}
          
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="large"
            fullWidth
          >
            戻る
          </Button>
        </div>

        {/* 注意事項 */}
        <Card padding="small" className="bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <p>・参加確定後のキャンセルはできません</p>
            <p>・場所の予約は各自で行ってください</p>
            <p>・当日の連絡先は後日お知らせします</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Proposal;