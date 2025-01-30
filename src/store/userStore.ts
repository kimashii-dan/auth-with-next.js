/* eslint-disable @typescript-eslint/no-explicit-any */
import UserType from "@/types/UserType";
import StatsType from "@/types/StatsType";
import { create } from "zustand";
import axios from "axios";

interface UserStore {
  user: UserType | null;
  stats: StatsType | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserType) => void;
  setStats: (stats: StatsType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  stats: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/protected`);
      set({
        user: response.data.user_data,
        stats: response.data.stats_data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch user data",
        loading: false,
      });
    }
  },
}));
