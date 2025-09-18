import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isToday,
  isSameDay
} from 'date-fns';
import { COLORS } from '../../../utils/constants';
import { CalendarEvent } from '../../../types/event';

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  events,
  onDateClick
}) => {
  // カレンダーの日付範囲を計算
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 日曜日開始
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // 曜日ヘッダー
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // 指定日にイベントがあるかチェック
  const hasEvent = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  // 日付セルのスタイルを決定
  const getDayStyle = (date: Date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isTodayDate = isToday(date);
    const hasEventDate = hasEvent(date);

    if (isTodayDate) {
      // 今日の日付は赤背景
      return {
        backgroundColor: COLORS.PRIMARY,
        color: 'white'
      };
    } else if (hasEventDate && isCurrentMonth) {
      // 予定あり日付はピンク背景
      return {
        backgroundColor: COLORS.SECONDARY,
        color: COLORS.PRIMARY
      };
    } else if (!isCurrentMonth) {
      // 他月の日付は薄いグレー
      return {
        color: '#9CA3AF'
      };
    } else {
      // 通常の日付
      return {
        color: COLORS.TEXT
      };
    }
  };

  const getDayClasses = (date: Date) => {
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isTodayDate = isToday(date);
    const hasEventDate = hasEvent(date);

    return [
      'w-full',
      'h-10',
      'flex',
      'items-center',
      'justify-center',
      'text-sm',
      'font-medium',
      'rounded-lg',
      'cursor-pointer',
      'transition-all',
      'duration-200',
      (isTodayDate || (hasEventDate && isCurrentMonth)) ? '' : 'hover:bg-gray-100',
      !isCurrentMonth ? 'opacity-50' : ''
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium"
            style={{ 
              color: index === 0 ? COLORS.PRIMARY : COLORS.TEXT // 日曜日は赤色
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1 p-4">
        {calendarDays.map((date) => (
          <button
            key={date.toISOString()}
            className={getDayClasses(date)}
            style={getDayStyle(date)}
            onClick={() => onDateClick(date)}
            disabled={!isSameMonth(date, currentDate)}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;