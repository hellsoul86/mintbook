import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSummary } from '../api';
import type { Summary } from '../types';

const REFRESH_MS = 5000;

export function useSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [impact, setImpact] = useState(false);
  const lastHighlightRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
      setLastSync(Date.now());
      setIsOnline(true);

      const highlightId = data.highlight?.round_id ?? null;
      if (highlightId && highlightId !== lastHighlightRef.current) {
        lastHighlightRef.current = highlightId;
        setImpact(false);
        requestAnimationFrame(() => setImpact(true));
      }
    } catch (error) {
      console.error(error);
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return {
    summary,
    isOnline,
    lastSync,
    impact,
  };
}
