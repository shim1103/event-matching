import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { COLORS } from '../../../utils/constants';

interface MonthNavigatorProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth
}) => {
  const formatMonth = (date: Date) => {
    return format(date, 'yyyy年M月', { locale: ja });
  };

  return (
    <div className="flex items-center justify-between py-4 px-4">
      <button
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-xl"
        aria-label="前の月"
        style={{ color: COLORS.TEXT }}
      >
        ◀
      </button>
      
      <h2 
        className="text-lg font-semibold"
        style={{ color: COLORS.TEXT }}
      >
        {formatMonth(currentDate)}
      </h2>
      
      <button
        onClick={onNextMonth}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-xl"
        aria-label="次の月"
        style={{ color: COLORS.TEXT }}
      >
        ▶
      </button>
    </div>
  );
};

export default MonthNavigator;