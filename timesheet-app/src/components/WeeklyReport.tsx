import React, { useState, useEffect } from 'react';
import type { TimeEntry } from '../types';
import { getWeekStart, getWeekEnd, formatDate, formatDateForInput } from '../utils/dateUtils';
import { timeEntriesApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface WeeklyReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [weekEntries, setWeekEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadWeekData();
    }
  }, [isOpen, weekStart, user]);

  const loadWeekData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const weekEnd = getWeekEnd(weekStart);
      const entries = await timeEntriesApi.getByDateRange(
        user.id,
        formatDateForInput(weekStart),
        formatDateForInput(weekEnd)
      );
      setWeekEntries(entries);
    } catch (error) {
      console.error('Failed to load week data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateWeek = (direction: number) => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(weekStart.getDate() + (direction * 7));
    setWeekStart(newWeekStart);
  };

  const calculateTotals = () => {
    const totals: Record<string, number> = {};
    
    weekEntries.forEach(entry => {
      if (!totals[entry.client]) {
        totals[entry.client] = 0;
      }
      totals[entry.client] += entry.hours;
    });

    return totals;
  };

  if (!isOpen) return null;

  const weekEnd = getWeekEnd(weekStart);
  const totals = calculateTotals();
  const totalHours = Object.values(totals).reduce((sum, hours) => sum + hours, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Prev Week
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Weekly Report</h2>
          <button
            onClick={() => navigateWeek(1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Next Week →
          </button>
        </div>

        <p className="text-center text-gray-600 mb-8">
          {formatDate(weekStart)} - {formatDate(weekEnd)}
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {Object.keys(totals).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {Object.entries(totals).map(([client, hours]) => (
                    <div
                      key={client}
                      className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary-500"
                    >
                      <div className="font-semibold text-gray-800 mb-1">{client}</div>
                      <div className="text-2xl font-bold text-danger-500">{hours.toFixed(2)}h</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800 text-white p-6 rounded-xl text-center">
                  <h3 className="text-xl font-bold">Total Hours: {totalHours.toFixed(2)}</h3>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No entries for this week</p>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-success-500 text-white rounded-full font-semibold hover:bg-success-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};