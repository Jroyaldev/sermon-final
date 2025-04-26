import { useState, useEffect } from 'react';
import { formatFullDate, formatShortTime, getGreeting } from '@/lib/utils';

export function useDateTimeGreeting() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const formattedDate = formatFullDate(currentTime);
  const formattedTime = formatShortTime(currentTime);
  const greeting = getGreeting(currentTime);

  return { currentTime, formattedDate, formattedTime, greeting };
} 