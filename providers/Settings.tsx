'use client'

import { normalizeScreenTheme, resolveScreenTheme, ScreenTheme } from '@/lib/theme'
import React, { useEffect, useRef, useState } from 'react'

export interface Settings {
  screenTheme: ScreenTheme
  displayActionTime: boolean
  displayAlternative: boolean
  displayMainMenus: boolean
  displaySpecialMenus: boolean
  displaySideMenus: boolean
  displayMenuList: boolean
  displayHint: boolean
  cookSpeed: number
}

export type SettingsKey = keyof Settings

export interface ISettingsContext {
  data: Settings
  setData: (key: keyof Settings, value: Settings[keyof Settings]) => void
}

const SettingsContext = React.createContext<ISettingsContext>({} as ISettingsContext)

const DefaultSettings: Settings = {
  screenTheme: 'system',
  displayActionTime: false,
  displayAlternative: true,
  displayMainMenus: true,
  displaySpecialMenus: true,
  displaySideMenus: true,
  displayMenuList: true,
  displayHint: true,
  cookSpeed: 1,
}

export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Settings>(DefaultSettings)
  const [loaded, setLoaded] = useState(false)
  const dataRef = useRef<Settings>(DefaultSettings)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (!loaded) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const theme = resolveScreenTheme(data.screenTheme, query.matches)
      document.documentElement.dataset.theme = theme
      document.documentElement.style.colorScheme = theme
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [data.screenTheme, loaded])

  const loadSettings = () => {
    try {
      const raw = localStorage.getItem('ow_rest_settings')
      const parsed = raw ? JSON.parse(raw) : {}
      const saved = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
      const next: Settings = {
        ...DefaultSettings,
        ...saved,
        screenTheme: normalizeScreenTheme(saved.screenTheme),
      }
      setData(next)
      dataRef.current = next
    } catch {
      // Storage can be disabled; the selected theme still works for this visit.
    } finally {
      setLoaded(true)
    }
  }

  const saveData = (next: Settings) => {
    try {
      localStorage.setItem('ow_rest_settings', JSON.stringify(next))
    } catch {}
  }

  const handleSetData = (key: keyof Settings, value: Settings[keyof Settings]) => {
    const newData = { ...dataRef.current, [key]: value }
    setData(newData)
    saveData(newData)
    dataRef.current = newData
  }

  const context: ISettingsContext = {
    data,
    setData: handleSetData,
  }

  return <SettingsContext.Provider value={context}>{children}</SettingsContext.Provider>
}
