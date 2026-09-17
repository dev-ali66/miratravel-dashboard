import React, { createContext, useContext, useState } from "react"

export interface DevModeConfig {
  isDevMode: boolean
  showStyleControls: boolean
  showMultimediaTypeSwitcher: boolean
  showAdvancedButtonStyling: boolean
  showFieldBadges: boolean
}

// Static default configuration (Centralized single source of truth)
export const DEFAULT_DEV_MODE_CONFIG: DevModeConfig = {
  isDevMode: false, // Default is OFF (Simple Content Editor Mode)
  showStyleControls: false,
  showMultimediaTypeSwitcher: false,
  showAdvancedButtonStyling: false,
  showFieldBadges: false,
}

interface DevModeContextType {
  isDevMode: boolean
  setIsDevMode: (val: boolean) => void
  toggleDevMode: () => void
  config: DevModeConfig
  updateConfig: (patch: Partial<DevModeConfig>) => void
}

const DevModeContext = createContext<DevModeContextType>({
  isDevMode: DEFAULT_DEV_MODE_CONFIG.isDevMode,
  setIsDevMode: () => {},
  toggleDevMode: () => {},
  config: DEFAULT_DEV_MODE_CONFIG,
  updateConfig: () => {},
})

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [isDevMode, setIsDevModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("poli_dev_mode")
      return stored !== null ? JSON.parse(stored) : DEFAULT_DEV_MODE_CONFIG.isDevMode
    } catch {
      return DEFAULT_DEV_MODE_CONFIG.isDevMode
    }
  })

  const [config, setConfig] = useState<DevModeConfig>(() => ({
    ...DEFAULT_DEV_MODE_CONFIG,
    isDevMode,
    showStyleControls: isDevMode,
    showMultimediaTypeSwitcher: isDevMode,
    showAdvancedButtonStyling: isDevMode,
    showFieldBadges: isDevMode,
  }))

  // Auto-sync localStorage and config state whenever isDevMode changes
  React.useEffect(() => {
    try {
      localStorage.setItem("poli_dev_mode", JSON.stringify(isDevMode))
    } catch (e) {
      console.warn("Could not persist dev mode to localStorage", e)
    }

    setConfig((prev) => ({
      ...prev,
      isDevMode,
      showStyleControls: isDevMode,
      showMultimediaTypeSwitcher: isDevMode,
      showAdvancedButtonStyling: isDevMode,
      showFieldBadges: isDevMode,
    }))
  }, [isDevMode])

  const setIsDevMode = (val: boolean) => {
    setIsDevModeState(val)
  }

  const toggleDevMode = () => {
    setIsDevModeState((prev) => !prev)
  }

  const updateConfig = (patch: Partial<DevModeConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }))
  }

  return (
    <DevModeContext.Provider
      value={{
        isDevMode,
        setIsDevMode,
        toggleDevMode,
        config,
        updateConfig,
      }}
    >
      {children}
    </DevModeContext.Provider>
  )
}

export function useDevMode() {
  return useContext(DevModeContext)
}
