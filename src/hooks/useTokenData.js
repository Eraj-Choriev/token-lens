import { useState, useEffect, useCallback } from 'react';
import {
  generateWeeklyData, generateHourlyData, generateTaskBreakdown,
  generateRecentRequests, generateSessionData, generateStats,
} from '../data/mockData';

const REFRESH_INTERVAL = 60_000; // 1 minute

export function useTokenData() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    // Simulate realistic API latency (Claude API would be called here)
    await new Promise(r => setTimeout(r, isRefresh ? 600 : 900));

    const fresh = {
      stats:          generateStats(),
      weekly:         generateWeeklyData(),
      hourly:         generateHourlyData(),
      taskBreakdown:  generateTaskBreakdown(),
      recentRequests: generateRecentRequests(),
      session:        generateSessionData(),
    };

    setData(fresh);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, refreshing, lastUpdated, refresh: () => fetchData(true) };
}
