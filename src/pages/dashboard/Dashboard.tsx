import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/calendar/Calendar';
import { getCalendarList } from '../../services/api/client';
import { CalendarItem } from '../../services/api/dto/getCalendarListApi-dto';
import userCalendarsData from '../../dummydata/user_calendars.json';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userCalendars, setUserCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  console.log('Dashboard currentUserId', currentUserId);


  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    setCurrentUserId(currentUserId || '');
    if (!currentUserId) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    // APIからユーザーの予定を取得
    const fetchUserCalendars = async () => {
      try {
        setLoading(true);
        const response = await getCalendarList(currentUserId || '');
        console.log('Dashboard response', response);

        const calendars = response.map((calendar) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const calendarId = calendar.calendarId || (calendar as any).calendarid || '';
          return ({
            calendarId: calendarId,
            date: calendar.date,
            status: calendar.status
          });
        });
        // APIレスポンスは配列なので直接使用
        setUserCalendars(calendars || []);
      } catch (error) {
        console.error('カレンダーデータの取得に失敗しました:', error);

        // エラーの場合はダミーデータを使用
        const dummyCalendars: CalendarItem[] = userCalendarsData
          .filter(cal => cal.user_id.toString() === currentUserId)
          .map(cal => ({
            calendarId: cal.id.toString(),
            date: cal.date,
            status: cal.status
          }));

        setUserCalendars(dummyCalendars);
      } finally {
        setLoading(false);
      }
    };

    if(currentUserId) {
    fetchUserCalendars();
    }
  }, [currentUserId]);

  const handleDateSelect = (date: Date) => {
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

    console.log('Dashboard selectedDateCalendar', selectedDateCalendar);

    // URLに日付とカレンダーIDを含める
    const urlParams = new URLSearchParams();
    urlParams.set('date', dateString);
    if (selectedDateCalendar) {
      urlParams.set('calendarId', selectedDateCalendar.calendarId);
    }

    const finalPath = `${path}?${urlParams.toString()}`;
    navigate(finalPath);
  };

  if (loading) {
    return <LoadingScreen show={true} message="読み込み中..." />;
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #fef7ed 0%, #f8fafc 100%)' }}>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border-2" style={{ borderColor: '#ef4444' }}>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}
            >
              <span className="text-white font-bold text-sm">📅</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">カレンダー</h2>
          </div>
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
