/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type AppStackParamList = {
  Login: undefined
  Root: NavigatorScreenParams<RootStackParamList> | undefined
  Modal: undefined
  NotFound: undefined
}

export type AppStackScreenProps<Screen extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  Screen
>

export type RootStackParamList = {
  ClassList: undefined
  Class: { id: number }
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, Screen>,
  NativeStackScreenProps<AppStackParamList>
>
