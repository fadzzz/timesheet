import { format, startOfDay, endOfDay } from 'date-fns';

/**
 * Get the start of the week (Saturday)
 * Saturday = 6, Sunday = 0, Monday = 1, etc.
 * Week starts Saturday, ends Friday
 */
export function getWeekStart(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysBack = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysBack);
  return startOfDay(weekStart);
}

/**
 * Get the end of the week (Friday)
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Friday
  return endOfDay(weekEnd);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date;
  return format(d, 'EEE, MMM d');
}

/**
 * Format date for input value (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get days in month for calendar
 */
export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  for (let d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  
  return days;
}

/**
 * Get calendar grid including padding days
 */
export function getCalendarGrid(date: Date): (Date | null)[] {
  const days = getDaysInMonth(date);
  const firstDay = days[0];
  const startingDayOfWeek = firstDay.getDay();
  
  const grid: (Date | null)[] = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    grid.push(null);
  }
  
  // Add all days of the month
  days.forEach(day => grid.push(day));
  
  return grid;
}