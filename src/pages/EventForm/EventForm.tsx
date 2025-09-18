import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ActivitySelector from '../../components/event/ActivitySelector';
import IntensitySelector from '../../components/event/IntensitySelector';
import GroupSizeSelector from '../../components/event/GroupSizeSelector';
import CapacitySelector from '../../components/event/CapacitySelector';
import { COLORS } from '../../utils/constants';

// フォームデータの型定義を修正
interface EventFormData {
  date: string;
  activity: 'ボードゲーム' | 'バレーボール' | 'カラオケ' | '映画鑑賞' | '';
  intensity: 'エンジョイ' | 'ガチ' | '';
  groupSize: number;
  totalCapacity: '4-6人' | '8-12人' | '';
}

const EventForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // カレンダーから渡された選択日付を取得
  const selectedDate = location.state?.selectedDate 
    ? new Date(location.state.selectedDate) 
    : new Date();

  // フォームの状態管理
  const [formData, setFormData] = useState<EventFormData>({
    date: selectedDate.toISOString().split('T')[0],
    activity: '',
    intensity: '',
    groupSize: 2,
    totalCapacity: ''
  });

  const handleActivityChange = (activity: string) => {
    setFormData(prev => ({ ...prev, activity: activity as EventFormData['activity'] }));
  };

  const handleIntensityChange = (intensity: string) => {
    setFormData(prev => ({ ...prev, intensity: intensity as EventFormData['intensity'] }));
  };

  const handleGroupSizeChange = (groupSize: number) => {
    setFormData(prev => ({ ...prev, groupSize }));
  };

  const handleCapacityChange = (totalCapacity: string) => {
    setFormData(prev => ({ ...prev, totalCapacity: totalCapacity as EventFormData['totalCapacity'] }));
  };

  const handleSubmit = () => {
    // 全ての項目が選択されているかチェック
    if (!formData.activity || !formData.intensity || !formData.totalCapacity) {
      alert('すべての項目を選択してください');
      return;
    }

    console.log('フォームデータ:', formData);
    
    // マッチング画面へ遷移
    navigate('/matching', { 
      state: { eventData: formData } 
    });
  };

  const formatSelectedDate = (date: Date) => {
    return format(date, 'M月d日（E）', { locale: ja });
  };

  const isFormValid = formData.activity && formData.intensity && formData.totalCapacity;

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 選択された日付表示 */}
        <Card padding="medium" className="text-center">
          <div style={{ backgroundColor: COLORS.SECONDARY, padding: '1rem', borderRadius: '0.5rem' }}>
            <h2 className="text-lg font-semibold" style={{ color: COLORS.PRIMARY }}>
              {formatSelectedDate(selectedDate)}
            </h2>
          </div>
        </Card>

        {/* アクティビティ選択 */}
        <Card>
          <ActivitySelector
            selectedActivity={formData.activity}
            onActivityChange={handleActivityChange}
          />
        </Card>

        {/* 楽しみ方選択 */}
        <Card>
          <IntensitySelector
            selectedIntensity={formData.intensity}
            onIntensityChange={handleIntensityChange}
          />
        </Card>

        {/* グループ人数設定 */}
        <Card>
          <GroupSizeSelector
            groupSize={formData.groupSize}
            onGroupSizeChange={handleGroupSizeChange}
            minSize={1}
            maxSize={8}
          />
        </Card>

        {/* 最終合計人数選択 */}
        <Card>
          <CapacitySelector
            selectedCapacity={formData.totalCapacity}
            onCapacityChange={handleCapacityChange}
          />
        </Card>

        {/* 送信ボタン */}
        <Card>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            fullWidth
            disabled={!isFormValid}
          >
            アプリにマッチングを依頼
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default EventForm;