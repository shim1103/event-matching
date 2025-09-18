import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MatchingStatus from '../../components/recruiting/MatchingStatus';
import ParticipantCounter from '../../components/recruiting/ParticipantCounter';
import { COLORS } from '../../utils/constants';

// 型定義をファイル内に移動
interface EventData {
  date: string;
  activity: 'ボードゲーム' | 'バレーボール' | 'カラオケ' | '映画鑑賞';
  intensity: 'エンジョイ' | 'ガチ';
  totalCapacity: '4-6人' | '8-12人';
}

interface MatchingState {
  currentParticipants: number;
  minParticipants: number;
  status: 'searching' | 'found' | 'matched';
  isAnimating: boolean;
}

// ===== API版 (将来実装) =====
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getMatchingStatus } from '../../services/api/events';

const Recruiting: React.FC = () => {
  const navigate = useNavigate();
  
  // デモ用のサンプルイベントデータ（他の画面から独立）
  const [eventData] = useState<EventData>({
    date: new Date().toISOString().split('T')[0],
    activity: 'ボードゲーム',
    intensity: 'エンジョイ',
    totalCapacity: '4-6人'
  });

  // ===== API版 (将来実装) =====
  // const eventId = 1; // 実際のeventId
  // const queryClient = useQueryClient();
  //
  // const { data: matchingData, isLoading, error } = useQuery({
  //   queryKey: ['matching', eventId],
  //   queryFn: () => getMatchingStatus(eventId),
  //   select: (response) => response.data,
  //   refetchInterval: 2000, // 2秒ごとにポーリング
  //   enabled: !!eventId,
  // });
  //
  // const matchingState = {
  //   currentParticipants: matchingData?.participants.current || 1,
  //   minParticipants: matchingData?.participants.min || 4,
  //   status: matchingData?.status || 'searching',
  //   isAnimating: false
  // };

  // マッチング状態管理（ダミー実装）
  const [matchingState, setMatchingState] = useState<MatchingState>({
    currentParticipants: 1, // 自分を含む
    minParticipants: 4,
    status: 'searching',
    isAnimating: false
  });

  // マッチングのシミュレーション（ダミー実装）
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchingState(prev => {
        // 参加者が最小人数に達していない場合、ランダムに増加
        if (prev.currentParticipants < prev.minParticipants) {
          const shouldIncrease = Math.random() > 0.7; // 30%の確率で参加者増加
          if (shouldIncrease) {
            const newCount = prev.currentParticipants + 1;
            return {
              ...prev,
              currentParticipants: newCount,
              status: newCount >= prev.minParticipants ? 'found' : 'searching',
              isAnimating: true
            };
          }
        }
        return { ...prev, isAnimating: false };
      });
    }, 2000); // 2秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  // マッチング完了時の処理
  useEffect(() => {
    if (matchingState.status === 'found') {
      const timer = setTimeout(() => {
        setMatchingState(prev => ({ ...prev, status: 'matched' }));
      }, 3000); // 3秒後にマッチング完了
      
      return () => clearTimeout(timer);
    }
  }, [matchingState.status]);

  // ===== API版のマッチング完了検知 (将来実装) =====
  // useEffect(() => {
  //   if (matchingData?.status === 'found') {
  //     const timer = setTimeout(() => {
  //       // プロポーザル画面へ自動遷移
  //       navigate('/proposal', { 
  //         state: { 
  //           eventData, 
  //           matchingResult: matchingData,
  //           eventId
  //         } 
  //       });
  //     }, 3000);
  //     
  //     return () => clearTimeout(timer);
  //   }
  // }, [matchingData?.status, navigate, eventData, eventId]);

  const handleContinue = () => {
    // プロポーザル画面へ遷移
    navigate('/proposal', { 
      state: { 
        eventData, 
        matchingResult: matchingState 
      } 
    });
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

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* タイトル */}
        <div className="text-center">
          <h1 
            className="text-xl font-bold"
            style={{ color: COLORS.TEXT }}
          >
            マッチング中
          </h1>
        </div>

        {/* マッチング状況表示 */}
        <Card>
          <MatchingStatus
            eventData={{
              ...eventData,
              date: formatEventDate(eventData.date)
            }}
            currentParticipants={matchingState.currentParticipants}
            minParticipants={matchingState.minParticipants}
            status={matchingState.status}
          />
        </Card>

        {/* 参加者カウンター */}
        <Card>
          <ParticipantCounter
            currentCount={matchingState.currentParticipants}
            targetCount={matchingState.minParticipants}
            isAnimating={matchingState.isAnimating}
          />
        </Card>

        {/* ステータスメッセージ */}
        <Card padding="medium" className="text-center">
          <div className="space-y-3">
            {matchingState.status === 'searching' && (
              <>
                <div className="text-lg font-medium" style={{ color: COLORS.TEXT }}>
                  あなたと一緒に楽しむ仲間を探しています
                </div>
                <div className="text-sm text-gray-500">
                  しばらくお待ちください...
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.PRIMARY }}></div>
                </div>
              </>
            )}
            
            {matchingState.status === 'found' && (
              <>
                <div className="text-lg font-medium" style={{ color: COLORS.PRIMARY }}>
                  素敵な仲間が見つかりました！
                </div>
                <div className="text-sm text-gray-500">
                  場所の候補を検索しています...
                </div>
              </>
            )}
            
            {matchingState.status === 'matched' && (
              <>
                <div className="text-lg font-medium" style={{ color: COLORS.SUCCESS }}>
                  マッチング完了！
                </div>
                <div className="text-sm text-gray-500">
                  おすすめの場所をご提案します
                </div>
              </>
            )}
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3">
          {matchingState.status === 'matched' && (
            <Button
              onClick={handleContinue}
              variant="primary"
              size="large"
              fullWidth
            >
              提案を確認する
            </Button>
          )}
          
          <Button
            onClick={handleCancel}
            variant="outline"
            size="large"
            fullWidth
          >
            キャンセル
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Recruiting;