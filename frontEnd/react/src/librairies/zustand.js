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
    }),
    {
      name: 'app-storage', // clé dans localStorage
    }
  )
);

   export default store