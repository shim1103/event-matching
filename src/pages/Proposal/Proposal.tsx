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

// 型定義をファイル内に移動
interface Venue {
  id: number;
  name: string;
  address: string;
  category: string;
  capacity: number;
  rating: number;
  priceRange?: string;
  description?: string;
}

// ===== API版 (将来実装) =====
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { getRecommendedVenues } from '../../services/api/venues';
// import { confirmEventParticipation } from '../../services/api/events';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Matchingから渡されたデータを取得、または独立したサンプルデータを使用
  const eventData = location.state?.eventData || {
    date: new Date().toISOString().split('T')[0],
    activity: 'ボードゲーム' as const,
    intensity: 'エンジョイ' as const,
    totalCapacity: '4-6人' as const
  };

  const matchingResult = location.state?.matchingResult || {
    currentParticipants: 4,
    status: 'matched'
  };

  // ===== API版 (将来実装) =====
  // const eventId = location.state?.eventId;
  // 
  // const { data: venuesResponse, isLoading: venuesLoading, error: venuesError } = useQuery({
  //   queryKey: ['recommendedVenues', eventData.activity, eventData.totalCapacity],
  //   queryFn: () => getRecommendedVenues(eventData.activity, eventData.totalCapacity),
  //   select: (response) => response.data
  // });
  //
  // const confirmParticipationMutation = useMutation({
  //   mutationFn: (venueId: number) => confirmEventParticipation(eventId, venueId),
  //   onSuccess: (response) => {
  //     console.log('参加確定成功:', response.data);
  //     alert('イベントが確定しました！楽しんでください🎉');
  //     navigate('/matching'); // マッチング画面に戻る
  //   },
  //   onError: (error) => {
  //     console.error('参加確定エラー:', error);
  //     alert(`参加確定に失敗しました: ${error.message}`);
  //   }
  // });

  // ダミーデータから場所候補を取得
  const [recommendedVenues, setRecommendedVenues] = useState<Venue[]>([]);
  const [otherVenues, setOtherVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    // アクティビティに基づいて場所をフィルタリング
    const filteredVenues = venuesData.filter(venue => 
      venue.category === eventData.activity
    );
    
    // おすすめ場所（最初の2つ）とその他の場所に分割
    setRecommendedVenues(filteredVenues.slice(0, 2));
    setOtherVenues(filteredVenues.slice(2));
  }, [eventData.activity]);

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  const handleParticipate = () => {
    if (!selectedVenue) {
      alert('場所を選択してください');
      return;
    }

    // ===== 現在の実装（ダミーデータ） =====
    console.log('参加確定:', {
      eventData,
      venue: selectedVenue,
      participants: matchingResult.currentParticipants
    });
    
    alert('イベントが確定しました！楽しんでください🎉');
    navigate('/matching'); // マッチング画面に戻る

    // ===== API版 (将来実装) =====
    // confirmParticipationMutation.mutate(selectedVenue.id);
  };

  const handleDecline = () => {
    // ===== API版のキャンセル処理 (将来実装) =====
    // if (eventId) {
    //   cancelMatching(eventId).then(() => {
    //     navigate('/matching');
    //   }).catch((error) => {
    //     console.error('辞退エラー:', error);
    //     alert('辞退処理に失敗しました');
    //   });
    // } else {
    //   navigate('/matching');
    // }

    navigate('/matching');
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'M月d日（E）', { locale: ja });
    } catch {
      return dateString;
    }
  };

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
            participantCount={matchingResult.currentParticipants}
          />
        </Card>

        {/* おすすめ場所 */}
        {recommendedVenues.length > 0 && (
          <div className="space-y-3">
            <h2 
              className="text-lg font-semibold"
              style={{ color: COLORS.TEXT }}
            >
              🎯 おすすめの場所
            </h2>
            <div className="space-y-3">
              {recommendedVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isRecommended={true}
                  onSelect={() => handleVenueSelect(venue)}
                />
              ))}
            </div>
          </div>
        )}

        {/* その他の場所 */}
        {otherVenues.length > 0 && (
          <div className="space-y-3">
            <h2 
              className="text-lg font-semibold"
              style={{ color: COLORS.TEXT }}
            >
              📍 その他の候補
            </h2>
            <div className="space-y-3">
              {otherVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isRecommended={false}
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
          <Button
            onClick={handleParticipate}
            variant="primary"
            size="large"
            fullWidth
            disabled={!selectedVenue}
            // disabled={!selectedVenue || confirmParticipationMutation.isPending} // API版
          >
            {/* {confirmParticipationMutation.isPending ? '確定中...' : '参加する'} // API版 */}
            参加する
          </Button>
          
          <Button
            onClick={handleDecline}
            variant="outline"
            size="large"
            fullWidth
          >
            辞退する
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