import React, { useState } from 'react';
// スタイルシートもインポートします
import 'react-calendar/dist/Calendar.css'; // カレンダーの基本スタイル

import ReactCalendar from 'react-calendar'; // ←名前を変更して競合を回避

import { CalendarItem } from '../../services/api/dto/getCalendarListApi-dto';

interface CalendarComponentProps {
  onDateSelect?: (date: Date) => void;
  userCalendars: CalendarItem[];
}

const Calendar: React.FC<CalendarComponentProps> = ({ onDateSelect, userCalendars }) => { // ←コンポーネント名をCalendarに変更
  // 本日の日付を管理するためのState
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
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3) !important;
        }
        .calendar-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3) !important;
        }
        .calendar-gray {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
          color: white !重要;
          box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3) !important;
        }
        .calendar-blue {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
          color: white !important;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3) !important;
        }
        
        /* 日曜日から始まるカレンダーのスタイル */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
          border: 2px solid #ef4444;
          border-radius: 12px;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.125em;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }
        
        /* 日曜日を最初に表示するためのCSS Grid */
        .react-calendar__month-view__days {
          display: grid !重要;
          grid-template-columns: repeat(7, 1fr);
        }
        
        .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6.6667px;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 13px;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #fecaca;
        }
        
        .react-calendar__tile--now {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%) !important;
          color: white !important;
          font-weight: bold;
          border: none !important;
        }
        
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
          border: none !important;
        }
        
        .react-calendar__tile--hasActive {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
        }
        
        .react-calendar__tile--hasActive:enabled:hover,
        .react-calendar__tile--hasActive:enabled:focus {
          background: linear-gradient(135deg, #fdba74 0%, #fb923c 100%);
        }
        
        .react-calendar__tile--active {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }
        
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }
      `}</style>
      <ReactCalendar // ←react-calendarのコンポーネント名を変更
        // 本日の日付
        onChange={(value) => handleDateChange(value as Date)}
        // カレンダーに表示する値
        value={value}
        // 英語ロケールを設定（日曜日から始まる）
        locale="en-US"
        // カレンダーの表示形式を設定（日曜日から始まる）
        formatShortWeekday={(locale, date) => {
          const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
          return weekdays[date.getDay()];
        }}
        // 日付に応じてクラス名を適用
        tileClassName={getTileClassName}
        // カスタムスタイルを適用
        className="custom-calendar"
      />
      <div className="mt-4 text-center text-gray-600">
        <p>本日の日付: {value.toLocaleDateString('ja-JP')}</p>
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-red-50 to-red-100 rounded-full border border-red-200">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm"></div>
            <span className="text-red-700 font-medium">募集中</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-200">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm"></div>
            <span className="text-emerald-700 font-medium">マッチング済み</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; // ←export名をCalendarに変更