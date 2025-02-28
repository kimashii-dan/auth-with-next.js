/* eslint-disable @typescript-eslint/no-explicit-any */
import UserType from "@/types/UserType";
import StatsType from "@/types/StatsType";
import { create } from "zustand";
import RaceType from "@/types/RaceType";
import api from "@/util/axiosInstance";

interface UserStore {
  user: UserType | null;
  stats: StatsType | null;
  races: RaceType[] | null;
  loading: boolean;
  error: string | null;

  setUser: (user: UserType) => void;
  setStats: (stats: StatsType) => void;
  setRaces: (race: RaceType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserData: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  stats: null,
  races: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  setRaces: (races) => set({ races }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/users/protected`, {
        withCredentials: true,
      });
      set({
        user: response.data.user_data,
        stats: response.data.stats_data,
        races: response.data.races_data || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch user data",
        loading: false,
      });
    }
  },
  clearUser: () => {
    set({
      user: null,
      stats: null,
      races: null,
      error: null,
      loading: false,
    });
  },
}));
