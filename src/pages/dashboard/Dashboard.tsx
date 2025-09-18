import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/Calendar';
import { getUserCalendars } from '../../services/api/calendarApi';

interface CalendarResponse {
  calenderid: number;
  date: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userCalendars, setUserCalendars] = useState<CalendarResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // ログイン中のユーザーID（定数として設定）
  const currentUserId = 1;

  useEffect(() => {
    // APIからユーザーの予定を取得
    const fetchUserCalendars = async () => {
      try {
        setLoading(true);
        const calendars = getUserCalendars(currentUserId);
        // console.log('calendars', calendars);
        setUserCalendars(calendars);
      } catch (error) {
        console.error('カレンダーデータの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCalendars();
  }, [currentUserId]);

  const handleDateSelect = (date: Date) => {
    // 選択された日付をstateとして渡してRegisterページに遷移
    const dateString = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
    
    // 該当日のcalendarデータを取得
    const selectedDateCalendar = userCalendars.find(cal => cal.date === dateString);
    let path = '';

    switch (selectedDateCalendar?.status) {
      case 'recruiting':
        path = '/recruiting';
        break;
      case 'matched':
        path = '/proposal';
        break;
      // case 'closed':
      //   path = '/closed';
      //   break;
      // case 'cancelled':
      //   path = '/cancelled';
      //   break;
      default:
        path = '/register';
        break;
    }

    // URLに日付とカレンダーIDを含める
    const urlParams = new URLSearchParams();
    urlParams.set('date', dateString);
    if (selectedDateCalendar) {
      urlParams.set('calendarId', selectedDateCalendar.calenderid.toString());
    }
    
    const finalPath = `${path}?${urlParams.toString()}`;
    navigate(finalPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">カレンダー</h2>
          <Calendar 
            onDateSelect={handleDateSelect} 
            userCalendars={userCalendars}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
