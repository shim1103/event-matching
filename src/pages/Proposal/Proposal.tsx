import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EventSummary from '../../components/event/EventSummary';
import VenueCard from '../../components/venue/VenueCard';
import { COLORS } from '../../utils/constants';
import { Venue } from '../../types/venue';
import venuesData from '../../dummydata/venues.json';

const Proposal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Matchingページから渡されたデータを取得
  const { eventData, matchingResult } = location.state || {
    eventData: {
      date: new Date().toISOString().split('T')[0],
      activity: 'ボードゲーム',
      intensity: 'エンジョイ',
      totalCapacity: '4-6人'
    },
    matchingResult: {
      currentParticipants: 4
    }
  };

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [recommendedVenues, setRecommendedVenues] = useState<Venue[]>([]);

  // 活動に基づいて場所を絞り込み
  useEffect(() => {
    const filteredVenues = venuesData.filter(venue => 
      venue.category === eventData.activity
    );
    
    // 評価順にソートして上位2つを推奨
    const sortedVenues = filteredVenues.sort((a, b) => b.rating - a.rating);
    setRecommendedVenues(sortedVenues.slice(0, 2));
    
    // 最初のおすすめ場所を自動選択
    if (sortedVenues.length > 0) {
      setSelectedVenue(sortedVenues[0]);
    }
  }, [eventData.activity]);

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  const handleAccept = () => {
    if (!selectedVenue) {
      alert('場所を選択してください');
      return;
    }

    // 参加確定の処理
    console.log('イベント参加確定:', {
      eventData,
      selectedVenue,
      participants: matchingResult.currentParticipants
    });
    
    alert(`${selectedVenue.name}での${eventData.activity}に参加が確定しました！`);
    navigate('/dashboard');
  };

  const handleDecline = () => {
    // 参加辞退の処理
    navigate('/dashboard');
  };

  const getCategoryEmoji = (category: string): string => {
    switch (category) {
      case 'ボードゲーム':
        return '🎲';
      case 'バレーボール':
        return '🏐';
      case 'カラオケ':
        return '🎤';
      case '映画鑑賞':
        return '🎬';
      default:
        return '📍';
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
            場所の提案
          </h1>
          <div className="text-sm text-gray-500 mt-1">
            あなたにおすすめの場所をご提案します
          </div>
        </div>

        {/* イベント詳細サマリー */}
        <Card>
          <EventSummary
            eventData={eventData}
            participantCount={matchingResult.currentParticipants}
          />
        </Card>

        {/* おすすめ場所セクション */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryEmoji(eventData.activity)}</span>
            <h2 
              className="text-lg font-semibold"
              style={{ color: COLORS.TEXT }}
            >
              おすすめの場所
            </h2>
          </div>

          {/* 場所リスト */}
          <div className="space-y-3">
            {recommendedVenues.map((venue, index) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                isRecommended={index === 0}
                onSelect={() => handleVenueSelect(venue)}
              />
            ))}
          </div>
        </div>

        {/* 選択された場所の詳細 */}
        {selectedVenue && (
          <Card>
            <div className="space-y-3">
              <div className="text-center">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: COLORS.PRIMARY }}
                >
                  選択中の場所
                </h3>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-lg" style={{ color: COLORS.TEXT }}>
                  {selectedVenue.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  📍 {selectedVenue.address}
                </div>
                <div className="text-sm text-gray-600">
                  💰 {selectedVenue.priceRange}
                </div>
                {selectedVenue.amenities && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedVenue.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* アクションボタン */}
        <div className="space-y-3">
          <Button
            onClick={handleAccept}
            variant="primary"
            size="large"
            fullWidth
            disabled={!selectedVenue}
          >
            この内容で参加する
          </Button>
          
          <Button
            onClick={handleDecline}
            variant="outline"
            size="large"
            fullWidth
          >
            参加しない
          </Button>
        </div>

        {/* 注意事項 */}
        <Card padding="small">
          <div className="text-xs text-gray-500 space-y-1">
            <div>※ 参加確定後のキャンセルはできません</div>
            <div>※ 場所の詳細は参加者全員に共有されます</div>
            <div>※ 当日の連絡先は別途ご案内します</div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Proposal;