import React, { useEffect } from 'react'
import { api, useStore } from '@essar05/student-manager-core'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppNavigation from './src/navigation/navigation'
import { API_URL } from './src/shared/constants'
import useCachedResources from './src/shared/hooks/useCachedResources'
import useColorScheme from './src/shared/hooks/useColorScheme'
import { getStorageItem } from './src/shared/storage'
import { DARK_THEME, LIGHT_THEME } from './src/shared/themes'

import 'react-native-get-random-values'

api.defaults.baseURL = API_URL

export default function App() {
  const isInitialized = useStore(state => state.ui.isInitialized)
  const initializeApp = useStore(state => state.initialize)

  const isAuthenticated = useStore(state => state.auth.isAuthenticated)
  const updateToken = useStore(state => state.auth.actions.updateToken)
  const logout = useStore(state => state.auth.actions.logout)

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

  useEffect(() => {
    if (!isInitialized && isAuthenticated) {
      initializeApp()
    }
  }, [initializeApp, isAuthenticated, isInitialized])

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
