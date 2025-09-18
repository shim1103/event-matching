import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar/Calendar';
import { getCalenderList } from '../../services/api/client';
import { CalendarItem } from '../../services/api/dto/getCalenderListApi-dto';
import userCalendarsData from '../../dummydata/user_calendars.json';
import Layout from '../../components/common/Layout';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userCalendars, setUserCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ログイン中のユーザーID（定数として設定）
  const currentUserId = "1";

  useEffect(() => {
    // APIからユーザーの予定を取得
    const fetchUserCalendars = async () => {
      try {
        setLoading(true);
        const response = await getCalenderList(currentUserId);
        console.log('Dashboard response', response);
        // APIレスポンスは配列なので直接使用
        setUserCalendars(response || []);
      } catch (error) {
        console.error('カレンダーデータの取得に失敗しました:', error);

        // エラーの場合はダミーデータを使用
        const dummyCalendars: CalendarItem[] = userCalendarsData
          .filter(cal => cal.user_id.toString() === currentUserId)
          .map(cal => ({
            calenderId: cal.id.toString(),
            date: cal.date,
            status: cal.status
          }));

        setUserCalendars(dummyCalendars);
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
      urlParams.set('calendarId', selectedDateCalendar.calenderId);
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
    <Layout>
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
    </Layout>
  );
};

export default Dashboard;
