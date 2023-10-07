import { memo, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Card, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStyles } from '../../../shared/hooks/useStyles'
import { negativeColor, positiveColor } from '../../../shared/themes'
import { styles } from './Actions.styles'

interface ActionsProps {
  handleAddMark: (mark: number) => () => void
  handleUpVote: () => void
  handleDownVote: () => void
}

export const Actions = memo(({ handleAddMark, handleUpVote, handleDownVote }: ActionsProps) => {
  const theme = useTheme()
  const styled = useStyles(styles)

  const actionRightStyle = useMemo(() => StyleSheet.compose(styled.action, styled.actionRight), [])
  const actionsBottomStyle = useMemo(() => StyleSheet.compose(styled.actions, styled.actionsBottom), [])

  return (
    <>
      <Card.Content style={styled.actions}>
        {MARKS.slice(0, 5).map(mark => (
          <Button
            key={mark}
            style={styled.action}
            contentStyle={styled.actionContent}
            labelStyle={styled.actionLabel}
            mode="outlined"
            textColor={theme.colors.onSurface}
            onPress={handleAddMark(mark)}
          >
            {mark}
          </Button>
        ))}

        <Button
          style={actionRightStyle}
          contentStyle={styled.actionContent}
          labelStyle={styled.actionLabel}
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
            style={styled.action}
            contentStyle={styled.actionContent}
            labelStyle={styled.actionLabel}
            textColor={theme.colors.onSurface}
            mode="outlined"
            onPress={handleAddMark(mark)}
          >
            {mark}
          </Button>
        ))}

        <Button
          style={actionRightStyle}
          contentStyle={styled.actionContent}
          labelStyle={styled.actionLabel}
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
