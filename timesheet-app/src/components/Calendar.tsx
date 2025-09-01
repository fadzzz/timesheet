import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { getCalendarGrid } from '../utils/dateUtils';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const calendarGrid = getCalendarGrid(today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      <h4 className="text-center mb-4 text-gray-800 font-semibold text-lg">
        {monthNames[currentMonth]} {currentYear}
      </h4>
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 bg-gray-100 rounded-md py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarGrid.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                min-h-[40px] rounded-md border-2 transition-all duration-200
                flex items-center justify-center text-sm font-medium
                ${isSelected && !isTodayDate
                  ? 'bg-primary-500 text-white border-primary-600'
                  : isTodayDate
                  ? 'bg-danger-500 text-white border-danger-600'
                  : 'bg-white border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                }
              `}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};