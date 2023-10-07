import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { MD3Theme, useTheme } from 'react-native-paper'

type NamedStyle<T> = StyleSheet.NamedStyles<T>

export const useStyles = <T extends NamedStyle<T> | NamedStyle<never>>(styleFactory: StyleFactory<T>) => {
  const theme = useTheme()
  return useMemo(() => StyleSheet.create(styleFactory(theme)), [styleFactory, theme])
}

export type StyleFactory<T extends NamedStyle<T> | NamedStyle<never>> = (theme: MD3Theme) => T

export const makeStyles = <T extends NamedStyle<T> | NamedStyle<never>>(styleFactory: StyleFactory<T>) => styleFactory
