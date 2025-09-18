import React, { useState } from 'react';
// スタイルシートもインポートします
import 'react-calendar/dist/Calendar.css'; // カレンダーの基本スタイル

import Calendar from 'react-calendar';

interface CalendarResponse {
  calenderid: number;
  date: string;
  status: string;
}

interface CalendarComponentProps {
  onDateSelect?: (date: Date) => void;
  userCalendars: CalendarResponse[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelect, userCalendars }) => {
  // 選択された日付を管理するためのState
  const [value, onChange] = useState(new Date());

  const handleDateChange = (date: Date) => {
    onChange(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // 日付に応じてクラス名を返す関数
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0');

    //   console.log('dateString', dateString);
      
      // userCalendarsから該当日付の予定を検索
      const calendar = userCalendars.find(cal => cal.date === dateString);
    //   console.log('calendar', calendar);
      const status = calendar?.status;
      
      // ステータスに応じてクラス名を返す
      switch (status) {
        case 'recruiting':
          return 'calendar-yellow';
        case 'matched':
          return 'calendar-green';
        case 'closed':
          return 'calendar-gray';
        case 'cancelled':
          return 'calendar-gray';
        case 'unknown':
          return 'calendar-white';
        default:
          return '';
      }
    }
    return '';
  };


  return (
    <div className="calendar-container">
      <style>{`
        .calendar-yellow {
          background-color: #eab308 !important;
          color: white !important;
        }
        .calendar-green {
          background-color: #22c55e !important;
          color: white !important;
        }
        .calendar-gray {
          background-color: #6b7280 !important;
          color: white !important;
        }
        .calendar-blue {
          background-color: #3b82f6 !important;
          color: white !important;
        }
      `}</style>
      <Calendar
        // 選択された日付
        onChange={(value) => handleDateChange(value as Date)}
        // カレンダーに表示する値
        value={value}
        // 日本語ロケールを設定
        locale="ja-JP"
        // カレンダーの表示形式を設定（月曜日から始まる）
        formatShortWeekday={(locale, date) => {
          const weekdays = ['月', '火', '水', '木', '金', '土', '日'];
          return weekdays[date.getDay()];
        }}
        // 日付に応じてクラス名を適用
        tileClassName={getTileClassName}
        // カスタムスタイルを適用
        className="custom-calendar"
      />
      <div className="mt-4 text-center text-gray-600">
        <p>選択された日付: {value.toLocaleDateString('ja-JP')}</p>
        <div className="mt-2 flex items-center justify-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>募集中</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>マッチング済み</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>終了・キャンセル</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;