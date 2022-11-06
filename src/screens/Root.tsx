import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ClassList } from './ClassList/ClassList'
import { AppStackScreenProps } from '../navigation/types'
import { Class } from './Class/Class'
import { memo } from 'react'

const Stack = createNativeStackNavigator()

export const Root = memo((props: AppStackScreenProps<'Root'>) => {
  return (
    <Stack.Navigator initialRouteName="ClassList">
      <Stack.Screen name="ClassList" component={ClassList} options={{ headerShown: false }} />
      <Stack.Screen name="Class" component={Class} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
})

// const [ index, setIndex ] = React.useState(0);
// const [ routes ] = React.useState([
//   { key: 'Home', title: 'Music', icon: 'home' },
//   { key: 'TabTwo', title: 'Albums', icon: 'album' }
// ]);
//
// const renderScene = BottomNavigation.SceneMap({
//   Home: TabOneScreen,
//   TabTwo: TabTwoScreen
// });
//
// return (
//   <BottomNavigation
//     navigationState={{ index, routes }}
//     onIndexChange={setIndex}
//     renderScene={renderScene}
//     shifting={true}
//     activeColor={'#fff'}
//     inactiveColor={'#fff'}
//     barStyle={{ backgroundColor: '#694fad' }}
//   />
// );
