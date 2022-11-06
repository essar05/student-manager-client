import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'
import ModalScreen from '../screens/ModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import { AppStackParamList } from './types'
import LinkingConfiguration from './LinkingConfiguration'
import { Root } from '../screens/Root'
import { Login } from '../screens/Login/Login'
import { useStore } from '../shared/hooks/useStore'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<AppStackParamList>()

function RootNavigator() {
  const isAuthenticated = useStore(state => state.isAuthenticated)

  return (
    <Stack.Navigator>
      {!isAuthenticated && <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />}

      {isAuthenticated && (
        <>
          <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  )
}
