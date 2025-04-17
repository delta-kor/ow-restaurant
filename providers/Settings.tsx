'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface Settings {
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
  const dataRef = useRef<Settings>(DefaultSettings)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    if (!localStorage) return

    const settings = localStorage.getItem('ow_rest_settings')
    if (!settings) {
      saveData(data)
      return
    }

    try {
      const parsedSettings = JSON.parse(settings) as unknown
      if (typeof parsedSettings !== 'object' || parsedSettings === null) {
        saveData(data)
        return
      }

      const newSettings: Settings = { ...DefaultSettings, ...parsedSettings }
      setData(newSettings)
      dataRef.current = newSettings
    } catch (e) {
      saveData(data)
      return
    }
  }

  const saveData = (data: Settings) => {
    if (!localStorage) return
    localStorage.setItem('ow_rest_settings', JSON.stringify(data))
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
