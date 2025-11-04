'use client'

import { create } from 'zustand'

type CharacterType = 'adhi' | 'aura'
type StatusType = 'welcome' | 'thinking' | 'analyzing' | 'speaking' | 'processing' | 'bye' | 'aha_moment'

interface AppState {
  character: CharacterType
  status: StatusType
  audioEnabled: boolean
  setCharacter: (character: CharacterType) => void
  setStatus: (status: StatusType) => void
  toggleAudio: () => void
}

export const useAppStore = create<AppState>()((set) => ({
  character: 'aura',
  status: 'welcome',
  audioEnabled: false,
  setCharacter: (character) => set({ character }),
  setStatus: (status) => set({ status }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}))