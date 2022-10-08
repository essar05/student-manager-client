import { MD3Theme, useTheme } from 'react-native-paper'
import { ScrollView, ScrollViewProps, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'

export interface PageContainerProps extends ScrollViewProps {}

export const PageContainer = ({ ...props }: PageContainerProps) => {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const style = StyleSheet.compose<ViewStyle>(styles.surface, props.style)
  const contentContainerStyle = StyleSheet.compose<ViewStyle>(styles.surfaceContent, props.contentContainerStyle)

  return <ScrollView {...props} style={style} contentContainerStyle={contentContainerStyle} />
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    surface: {
      flex: 1,
      minHeight: '100%',
      backgroundColor: theme.colors.background,
    },
    surfaceContent: {
      minHeight: '100%',
    }
  })
