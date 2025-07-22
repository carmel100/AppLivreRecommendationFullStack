import { create } from "zustand";
import { persist } from 'zustand/middleware';

const store = create(
  persist(
    (set) => ({
      // Mot-clé
      word: 'naruto',
      setWord: (newWord) => set({ word: newWord }),

      // Thème
      changetheme: false,
      setChangetheme: () =>
        set((state) => ({
          changetheme: !state.changetheme,
        })),

      // Utilisateur
      user: null,
      setUser: (user) => set({ user }),

      // Refresh manuel d’un composant
      refreshKey: 0,
      incrementRefreshKey: () =>
        set((state) => ({ refreshKey: state.refreshKey + 1 })),

      // ✅ Loader global
      loading1: false,
      setLoading1: (isLoading) => set({ loading1: isLoading }),
    }),
    {
      name: 'app-storage', // clé dans localStorage
      partialize: (state) => ({
        word: state.word,
        changetheme: state.changetheme,
        user: state.user,
      }), // on ne persiste pas `loading` ou `refreshKey`
    }
  )
);

export default store;
