import { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AppStackScreenProps, RootStackParamList } from '../navigation/types'
import { Class } from './Class/Class'
import { ClassList } from './ClassList/ClassList'

const RootStack = createNativeStackNavigator<RootStackParamList>()

export const Root = memo((_: AppStackScreenProps<'Root'>) => {
  return (
    <RootStack.Navigator initialRouteName="ClassList">
      <RootStack.Screen name="ClassList" component={ClassList} options={{ headerShown: false }} />
      <RootStack.Screen name="Class" component={Class} options={{ headerShown: false }} />
    </RootStack.Navigator>
  )
})
