import { useState, useEffect, useCallback } from 'react';
import { Room } from '../types';
import { roomsService } from '../services/roomsService';
import { PAGINATION } from '../constants';

interface UseRoomsOptions {
  filters?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    maxPrice?: number;
    roomType?: string;
  };
}

interface UseRoomsReturn {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refetch: () => void;
}

export const useRooms = (options: UseRoomsOptions = {}): UseRoomsReturn => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(PAGINATION.INITIAL_PAGE);
  const [hasMore, setHasMore] = useState(true);

  const fetchRooms = useCallback(async (page: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await roomsService.getRooms({
        page,
        limit: PAGINATION.ROOMS_PER_PAGE,
        ...options.filters
      });

      if (reset) {
        setRooms(response.data);
      } else {
        setRooms(prev => [...prev, ...response.data]);
      }

      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [options.filters]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchRooms(currentPage + 1);
  }, [currentPage, hasMore, loading, fetchRooms]);

  const refetch = useCallback(() => {
    setCurrentPage(PAGINATION.INITIAL_PAGE);
    setHasMore(true);
    fetchRooms(PAGINATION.INITIAL_PAGE, true);
  }, [fetchRooms]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    rooms,
    loading,
    error,
    hasMore,
    fetchMore,
    refetch
  };
};