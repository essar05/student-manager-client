import React from 'react'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ColorSchemeName } from 'react-native'

import { Login } from '../screens/Login/Login'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import { Root } from '../screens/Root'
import { useStore } from '../shared/hooks/useStore'
import LinkingConfiguration from './LinkingConfiguration'
import { AppStackParamList } from './types'

export default function AppNavigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const AppStack = createNativeStackNavigator<AppStackParamList>()

function AppNavigator() {
  const isAuthenticated = useStore(state => state.isAuthenticated)

  return (
    <AppStack.Navigator>
      {!isAuthenticated && <AppStack.Screen name="Login" component={Login} options={{ headerShown: false }} />}

      {isAuthenticated && (
        <>
          <AppStack.Screen name="Root" component={Root} options={{ headerShown: false }} />
          <AppStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          <AppStack.Group screenOptions={{ presentation: 'modal' }}>
            <AppStack.Screen name="Modal" component={ModalScreen} />
          </AppStack.Group>
        </>
      )}
    </AppStack.Navigator>
  )
}
