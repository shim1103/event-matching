import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MatchingStatus from '../../components/matching/MatchingStatus';
import ParticipantCounter from '../../components/matching/ParticipantCounter';
import { COLORS } from '../../utils/constants';

const Matching: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // EventFormから渡されたデータを取得
  const eventData = location.state?.eventData || {
    date: new Date().toISOString().split('T')[0],
    activity: 'ボードゲーム',
    intensity: 'エンジョイ',
    totalCapacity: '4-6人'
  };

  // マッチング状態管理
  const [matchingState, setMatchingState] = useState({
    currentParticipants: 1, // 自分を含む
    minParticipants: 4,
    status: 'searching' as 'searching' | 'found' | 'matched',
    isAnimating: false
  });

  // マッチングのシミュレーション
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
    // ダッシュボードに戻る
    navigate('/dashboard');
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

export default Matching;