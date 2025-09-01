import React from 'react';
import type { TimeEntry } from '../types';
import { formatDate } from '../utils/dateUtils';
import { timeEntriesApi } from '../services/api';

interface RecentEntriesProps {
  entries: TimeEntry[];
  onDelete: () => void;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({ entries, onDelete }) => {
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;

    try {
      await timeEntriesApi.delete(id);
      onDelete(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">No entries yet - add your first time entry!</p>
      </div>
    );
  }

  // Show last 20 entries
  const recentEntries = entries.slice(0, 20);

  return (
    <div className="space-y-2">
      {recentEntries.map(entry => (
        <div
          key={entry.id}
          className="bg-gray-50 rounded-lg p-4 flex justify-between items-center border-l-4 border-primary-500"
        >
          <div>
            <div className="font-semibold text-gray-800">{entry.client}</div>
            <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-danger-500">{entry.hours}h</div>
            <button
              onClick={() => handleDelete(entry.id)}
              className="px-3 py-1 bg-danger-500 text-white text-sm rounded hover:bg-danger-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};