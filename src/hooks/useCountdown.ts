import { useEffect, useState } from 'react';
import { formatCountdown } from '../utils/format';

export function useCountdown(endTime?: string | null) {
  const [countdown, setCountdown] = useState('--:--');

  useEffect(() => {
    if (!endTime) {
      setCountdown('--:--');
      return;
    }

    const update = () => {
      const remaining = new Date(endTime).getTime() - Date.now();
      setCountdown(formatCountdown(remaining));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return countdown;
}
