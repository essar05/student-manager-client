import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './src/hooks/useCachedResources'
import useColorScheme from './src/hooks/useColorScheme'
import Navigation from './src/navigation/navigation'
import { useStore } from './src/shared/hooks/useStore'
import { getStorageItem } from './src/shared/storage'

export const LIGHT_THEME = {
  ...MD3LightTheme,
  roundness: 2,

  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(138,104,210)',
    background: '#e8e8e8',
    secondary: '#d2d2d2',
    // onSurface: '#ffffff',
    // background: 'red',
    // surface: 'green',
    // text: '#ffffff',
    // backdrop: 'pink'
  },
}

const DARK_THEME = {
  ...MD3DarkTheme,
  roundness: 2,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    background: 'rgb(26,26,30)',
    primary: 'rgb(86,130,211)',
    accent: '#f1c40f',
    surface: 'rgb(53,50,58)',
  },
}

export default function App() {
  console.log('hello world')

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

    initialize()
  }, [updateToken, isAuthenticated, logout])

  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  console.log(isLoadingComplete)
  console.log(isAuthenticated)

  if (!isLoadingComplete || isAuthenticated === undefined) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </PaperProvider>
      </SafeAreaProvider>
    )
  }
}
