import { memo, useMemo } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { MD3Theme, useTheme } from 'react-native-paper'

export interface PageContainerProps extends ScrollViewProps {}

export const PageContainer = memo((props: PageContainerProps) => {
  const theme = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const style = [styles.surface, props.style]
  const contentContainerStyle = useMemo(
    () => [styles.surfaceContent, props.contentContainerStyle],
    [props.contentContainerStyle, styles.surfaceContent]
  )

  return <ScrollView scrollEventThrottle={40} {...props} style={style} contentContainerStyle={contentContainerStyle} />
})

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    surface: {
      flex: 1,
      height: '100%',
      backgroundColor: theme.colors.background,
    },
    surfaceContent: {
      height: '100%',
    },
  })
