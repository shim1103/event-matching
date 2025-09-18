import React, { useState } from 'react';
// スタイルシートもインポートします
import 'react-calendar/dist/Calendar.css'; // カレンダーの基本スタイル

import ReactCalendar from 'react-calendar'; // ←名前を変更して競合を回避

import { CalendarItem } from '../../services/api/dto/getCalenderListApi-dto';

interface CalendarComponentProps {
  onDateSelect?: (date: Date) => void;
  userCalendars: CalendarItem[];
}

const Calendar: React.FC<CalendarComponentProps> = ({ onDateSelect, userCalendars }) => { // ←コンポーネント名をCalendarに変更
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
        
        /* 日曜日から始まるカレンダーのスタイル */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: white;
          border: 1px solid #a0a096;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.125em;
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
          display: grid !important;
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
          background-color: #e6e6e6;
        }
        
        .react-calendar__tile--now {
          background: #ffff76;
        }
        
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #ffffa9;
        }
        
        .react-calendar__tile--hasActive {
          background: #76baff;
        }
        
        .react-calendar__tile--hasActive:enabled:hover,
        .react-calendar__tile--hasActive:enabled:focus {
          background: #a9d4ff;
        }
        
        .react-calendar__tile--active {
          background: #006edc;
          color: white;
        }
        
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #1087ff;
        }
      `}</style>
      <ReactCalendar // ←react-calendarのコンポーネント名を変更
        // 選択された日付
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

export default Calendar; // ←export名をCalendarに変更