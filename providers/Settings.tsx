'use client'

import React, { useEffect } from 'react'

interface Settings {
  displayActionTime: boolean
  displayAlternative: boolean
  displaySideMenus: boolean
  displayMenuList: boolean
  displayHint: boolean
  cookSpeed: number
}

interface Context {
  data: Settings
  setData: (key: keyof Settings, value: Settings[keyof Settings]) => void
}

const SettingsContext = React.createContext<Context>({} as Context)

const DefaultSettings: Settings = {
  displayActionTime: false,
  displayAlternative: false,
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
  const [data, setData] = React.useState<Settings>(DefaultSettings)

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
    const newSettings = { ...DefaultSettings, [key]: value }
    setData(newSettings)
    saveData(newSettings)
  }

  const context: Context = {
    data,
    setData: handleSetData,
  }

  return <SettingsContext.Provider value={context}>{children}</SettingsContext.Provider>
}
