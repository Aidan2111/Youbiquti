// Time utility functions

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Format time for display (e.g., "7:00 PM")
 */
export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const h = hours ?? 0;
  const m = minutes ?? 0;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get day of week name
 */
export function getDayName(dayIndex: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] ?? 'Unknown';
}

/**
 * Get short day name
 */
export function getShortDayName(dayIndex: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex] ?? 'Unknown';
}

/**
 * Check if a time is within business hours
 */
export function isWithinHours(
  time: string,
  openTime: string,
  closeTime: string
): boolean {
  const timeMinutes = parseTime(time);
  const openMinutes = parseTime(openTime);
  let closeMinutes = parseTime(closeTime);
  
  // Handle closing after midnight (e.g., bar open until 2 AM)
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
    // If checking time is after midnight, add 24 hours
    if (timeMinutes < openMinutes) {
      return timeMinutes + 24 * 60 <= closeMinutes;
    }
  }
  
  return timeMinutes >= openMinutes && timeMinutes <= closeMinutes;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date short
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get date string in YYYY-MM-DD format
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const totalMinutes = parseTime(time) + minutesToAdd;
  return formatTime(totalMinutes);
}

/**
 * Get relative day description
 */
export function getRelativeDay(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return getDayName(target.getDay());
  
  return formatDateShort(date);
}
