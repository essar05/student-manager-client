import React, { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AppStackScreenProps, RootStackParamList } from '../navigation/types'
import { Class } from './Class/Class'
import { ClassList } from './ClassList/ClassList'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const Root = memo((props: AppStackScreenProps<'Root'>) => {
  return (
    <Stack.Navigator initialRouteName="ClassList">
      <Stack.Screen name="ClassList" component={ClassList} options={{ headerShown: false }} />
      <Stack.Screen name="Class" component={Class} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
})
