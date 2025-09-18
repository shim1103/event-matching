import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { registerCalendar, getHobbyList } from '../../services/api/client';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { RegisterCalendar, RegisterCalendarResponse } from '../../services/api/dto/registerCalendarApi-dto';

interface Hobby {
  hobbyId: string;
  name: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date') || '';

  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('');
  const [attendees, setAttendees] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [hobbiesLoading, setHobbiesLoading] = useState(true);

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
        setHobbiesLoading(true);
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
      } finally {
        setHobbiesLoading(false);
      }
    };

    if (userId) {
      fetchHobbies();
    }
  }, [userId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHobby || !timeSlot || !intensity) {
      alert('すべての項目を選択してください');
      return;
    }

    try {
      setLoading(true);

      // 現在のユーザーID（定数として設定）
      const calendarData = {
        hobbyId: selectedHobby,
        userId: userId,
        date: selectedDate,
        timeSlot: timeSlot as "morning" | "afternoon" | "evening",
        intensity: intensity as "serious" | "casual",
        attendees: attendees as number,
        status: 'recruiting' as "recruiting" | "matched" | "closed" | null // デフォルトで募集中
      };

      const response = await registerCalendar(userId || '', calendarData as RegisterCalendar);
      console.log('カレンダー登録成功:', response);


      let path = '';
      switch (response.status) {
        case 'recruiting':
          path = '/recruiting';
          break;
        case 'matched':
          path = '/proposal';
          break;
        default:
          path = '/dashboard';
          navigate(path);
          break;
      }
      // URLに日付とカレンダーIDを含める
      const urlParams = new URLSearchParams();
      urlParams.set('date', selectedDate);
      if (response.calendarId) {
        urlParams.set('calendarId', response.calendarId);
      }

      const finalPath = `${path}?${urlParams.toString()}`;
      navigate(finalPath);
    } catch (error) {
      console.error('カレンダー登録に失敗:', error);
      alert('カレンダー登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };


  if (loading) {
    return <LoadingScreen show={loading} message="登録中..." />;
  }

  return (
    <div className="min-h-screen p-2" style={{ background: 'linear-gradient(135deg, #fef7ed 0%, #f8fafc 100%)' }}>
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-4 border-2" style={{ borderColor: '#f59e0b' }}>
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              }}
            >
              <span className="text-white font-bold text-sm">📝</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">予定を登録</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* 日付表示 */}
            <div>
              <div className="border-2 rounded-xl p-3 text-center bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 shadow-md">
                <div className="font-bold text-xl text-amber-700">
                  {selectedDate ? new Date(selectedDate).getDate() : ''}
                </div>
                <div className="text-sm text-amber-600 font-medium">
                  {formatDate(selectedDate)}
                </div>
              </div>
            </div>

            {/* 趣味選択 */}
            <div>
              <h3 className="text-xs font-semibold mb-1">何をしたいですか？</h3>
              {hobbiesLoading ? (
                <div className="grid grid-cols-2 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-2 border-2 rounded-lg text-center text-xs bg-gray-100 animate-pulse"
                    >
                      読み込み中...
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {hobbies.slice(0, 4).map((hobby) => (
                    <button
                      key={hobby.hobbyId}
                      type="button"
                      onClick={() => setSelectedHobby(hobby.hobbyId)}
                      className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${selectedHobby === hobby.hobbyId
                        ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                        }`}
                    >
                      {hobby.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 時間帯選択 */}
            <div>
              <h3 className="text-xs font-semibold mb-1">時間帯を選択</h3>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setTimeSlot('morning')}
                  className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${timeSlot === 'morning'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                >
                  午前
                </button>
                <button
                  type="button"
                  onClick={() => setTimeSlot('afternoon')}
                  className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${timeSlot === 'afternoon'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                >
                  午後
                </button>
                <button
                  type="button"
                  onClick={() => setTimeSlot('evening')}
                  className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${timeSlot === 'evening'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                >
                  夜
                </button>
              </div>
            </div>

            {/* 強度選択 */}
            <div>
              <h3 className="text-xs font-semibold mb-1">どう楽しみたいですか？</h3>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setIntensity('casual')}
                  className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${intensity === 'casual'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                >
                  エンジョイ
                </button>
                <button
                  type="button"
                  onClick={() => setIntensity('serious')}
                  className={`p-2 border-2 rounded-xl text-center transition-all duration-200 text-xs font-medium ${intensity === 'serious'
                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                >
                  ガチ
                </button>
              </div>
            </div>

            {/* 参加者数 */}
            <div>
              <h3 className="text-xs font-semibold mb-1">参加者数</h3>
              <div className="flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAttendees(Math.max(1, attendees - 1))}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 text-xs"
                >
                  -
                </button>
                <span className="text-sm font-semibold">{attendees}人</span>
                <button
                  type="button"
                  onClick={() => setAttendees(Math.min(10, attendees + 1))}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* ボタン群 */}
            <div className="space-y-1">
              {/* 登録ボタン */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? '登録中...' : 'カレンダーを登録'}
              </button>

              {/* キャンセルボタン */}
              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
