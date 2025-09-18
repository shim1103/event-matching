import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { registerCalendar, getHobbyList } from '../../services/api/client';
import Layout from '../../components/common/Layout';

interface Hobby {
  hobbyId: string;
  name: string;
}

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get('date') || '';

  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('');
  const [attendees, setAttendees] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [hobbiesLoading, setHobbiesLoading] = useState(true);

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

    fetchHobbies();
  }, []);

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
      const currentUserId = "1";

      const calendarData = {
        hobbyId: selectedHobby,
        userId: currentUserId,
        date: selectedDate,
        timeSlot: timeSlot,
        intensity: intensity as "serious" | "casual",
        attendees: attendees as number,
        status: 'recruiting' as "recruiting" | "matched" | "closed" | null // デフォルトで募集中
      };

      const response = await registerCalendar(currentUserId, calendarData);
      console.log('カレンダー登録成功:', response);

      switch (response.status) {
        case 'recruiting':
          navigate('/recruiting');
          break;
        case 'matched':
          navigate('/proposal');
          break;
        default:
          navigate('/dashboard');
          break;
      }
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-3">予定を登録</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 日付表示 */}
              <div>
                <div className="border-2 rounded-lg p-2 text-center bg-pink-100 border-pink-300">
                  <div className="font-bold text-lg text-pink-600">
                    {selectedDate ? new Date(selectedDate).getDate() : ''}
                  </div>
                  <div className="text-xs text-gray-600">
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
                        className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${selectedHobby === hobby.hobbyId
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
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
                    className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${timeSlot === 'morning'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    午前
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeSlot('afternoon')}
                    className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${timeSlot === 'afternoon'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    午後
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
                    className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${intensity === 'casual'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    エンジョイ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntensity('serious')}
                    className={`p-2 border-2 rounded-lg text-center transition-colors text-xs ${intensity === 'serious'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
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
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '登録中...' : 'カレンダーを登録'}
                </button>

                {/* キャンセルボタン */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-xs hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
