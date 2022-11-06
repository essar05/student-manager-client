import { FlatList, FlatListProps, ScrollView, ScrollViewProps, StyleSheet, ViewStyle } from 'react-native'
import React, { memo, useMemo } from 'react'
import { MD3Theme, useTheme } from 'react-native-paper'

export interface PageListProps<T> extends FlatListProps<T> {

}

export const PageList = memo(({ ...props }: PageListProps<any>) => {
  const theme = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const style = StyleSheet.compose<ViewStyle>(styles.surface, props.style)
  const contentContainerStyle = useMemo(
    () => StyleSheet.compose<ViewStyle>(styles.surfaceContent, props.contentContainerStyle),
    [props.contentContainerStyle, styles.surfaceContent]
  )

  return <FlatList {...props} style={style} contentContainerStyle={contentContainerStyle} />
})

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    surface: {
      flex: 1,
      minHeight: '100%',
      backgroundColor: theme.colors.background,
    },
    surfaceContent: {
      minHeight: '100%',
    },
  })
