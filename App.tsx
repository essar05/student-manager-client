import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppNavigation from './src/navigation/navigation'
import useCachedResources from './src/shared/hooks/useCachedResources'
import useColorScheme from './src/shared/hooks/useColorScheme'
import { useStore } from './src/shared/hooks/useStore'
import { getStorageItem } from './src/shared/storage'
import { DARK_THEME, LIGHT_THEME } from './src/shared/themes'

export default function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated)
  const updateToken = useStore(state => state.updateToken)
  const logout = useStore(state => state.logout)

  useEffect(() => {
    const initialize = async () => {
      if (isAuthenticated === undefined) {
        let authToken

        try {
          authToken = await getStorageItem('auth-token')
        } catch (e) {
          // Restoring token failed
        }

        if (authToken) {
          updateToken(authToken)
        } else {
          logout()
        }
      }
    }

    initialize().catch(console.error)
  }, [updateToken, isAuthenticated, logout])

  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete || isAuthenticated === undefined) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
          <AppNavigation colorScheme={colorScheme} />

          <StatusBar />
        </PaperProvider>
      </SafeAreaProvider>
    )
  }
}
