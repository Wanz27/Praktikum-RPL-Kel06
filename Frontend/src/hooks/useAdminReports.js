import { useState, useCallback } from 'react';
import { fetchAllReports } from '../api/api';

export function useAdminReports() {
  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const data = await fetchAllReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { reports, fetchReports };
}
