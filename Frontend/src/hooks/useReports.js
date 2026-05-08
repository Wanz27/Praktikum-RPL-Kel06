import { useState, useCallback } from 'react';
import { fetchAllReports } from '../api/api';

export function useReports(userId) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, diproses: 0, selesai: 0 });

  const fetchReports = useCallback(async () => {
    try {
      const data = await fetchAllReports();
      const myReports = data.filter(r => Number(r.userId) === Number(userId));
      setReports(myReports);
      setStats({
        total: myReports.length,
        diproses: myReports.filter(r => r.status?.toLowerCase() === 'diproses').length,
        selesai:  myReports.filter(r => r.status?.toLowerCase() === 'selesai').length,
      });
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  return { reports, stats, fetchReports };
}
