import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Calendar from '../../components/calendar/Calendar';
import MonthNavigator from '../../components/calendar/MonthNavigator';
import { CalendarEvent } from '../../types/event';

// ダミーイベントデータ
const dummyEvents: CalendarEvent[] = [
  {
    id: 1,
    date: '2024-12-15',
    title: 'ボードゲーム',
    status: 'scheduled',
    hasEvent: true
  },
  {
    id: 2,
    date: '2024-12-20',
    title: 'バレーボール',
    status: 'scheduled',
    hasEvent: true
  },
  {
    id: 3,
    date: '2024-12-25',
    title: 'カラオケ',
    status: 'scheduled',
    hasEvent: true
  }
];

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date);
    // 日付選択時にイベント登録フォームへ遷移
    navigate('/form', { 
      state: { selectedDate: date.toISOString() } 
    });
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // 設定画面への遷移などを実装
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    // ログアウト処理を実装
  };

  return (
    <Layout 
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="max-w-md mx-auto p-4">
        <MonthNavigator
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <Calendar
          currentDate={currentDate}
          events={dummyEvents}
          onDateClick={handleDateClick}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
