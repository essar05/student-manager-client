import React, { memo, useMemo } from 'react'
import { Button, Card, MD3Theme, useTheme } from 'react-native-paper'
import { negativeColor, positiveColor } from '../../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, ViewStyle } from 'react-native'

interface ActionsProps {
  handleAddMark: (mark: number) => () => void
  handleUpVote: () => void
  handleDownVote: () => void
}

export const Actions = memo(({ handleAddMark, handleUpVote, handleDownVote }: ActionsProps) => {
  const theme = useTheme()
  const actionRightStyle = useMemo(
    () => StyleSheet.compose<ViewStyle>(styles.action, styles.actionRight),
    []
  )
  const actionsBottomStyle = useMemo(
    () => StyleSheet.compose<ViewStyle>(styles.actions, styles.actionsBottom),
    []
  )

  return (
    <>
      <Card.Content style={styles.actions}>
        {MARKS.slice(0, 5).map(mark => (
          <Button
            key={mark}
            style={styles.action}
            contentStyle={styles.actionContent}
            labelStyle={styles.actionLabel}
            mode="outlined"
            textColor={theme.colors.onSurface}
            onPress={handleAddMark(mark)}
          >
            {mark}
          </Button>
        ))}

        <Button
          style={actionRightStyle}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
          textColor={positiveColor}
          mode="outlined"
          onPress={handleUpVote}
        >
          <Icon name="thumb-up" size={16} />
        </Button>
      </Card.Content>

      <Card.Content style={actionsBottomStyle}>
        {MARKS.slice(5).map(mark => (
          <Button
            key={mark}
            style={styles.action}
            contentStyle={styles.actionContent}
            labelStyle={styles.actionLabel}
            textColor={theme.colors.onSurface}
            mode="outlined"
            onPress={handleAddMark(mark)}
          >
            {mark}
          </Button>
        ))}

        <Button
          style={actionRightStyle}
          contentStyle={styles.actionContent}
          labelStyle={styles.actionLabel}
          textColor={negativeColor}
          mode="outlined"
          onPress={handleDownVote}
        >
          <Icon name="thumb-down" size={16} />
        </Button>
      </Card.Content>
    </>
  )
})

const MARKS = Array(10)
  .fill(0)
  .map((_, index) => index + 1)

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
  actionsBottom: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  action: {
    flex: 1,
    minWidth: undefined,
    padding: 0,
    marginBottom: 5,
    marginRight: 5,
  },
  actionRight: {
    marginLeft: 10,
    marginBottom: 5,
    marginRight: 0,
  },
  actionContent: {
    padding: 0,
  },
  actionLabel: {
    marginLeft: 0,
    marginRight: 0,
  },
})
