import { memo } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Card, Chip, Text } from 'react-native-paper'

import { useStyles } from '../../../shared/hooks/useStyles'
import { ActivityScore } from '../../../shared/store/models/activityScore'
import { styles } from './MarksCell.styles'

interface MarksCellProps {
  style: ViewStyle
  labelStyle: TextStyle

  activityScores?: ActivityScore[]

  isCompact?: boolean
}

export const MarksCell = memo(({ style, labelStyle, activityScores, isCompact }: MarksCellProps) => {
  const styled = useStyles(styles)

  return (
    <Card.Content style={style}>
      {!isCompact && (
        <Text variant={'labelLarge'} style={labelStyle}>
          Note activitate
        </Text>
      )}

      <View style={styled.marks}>
        {activityScores?.map(activityScore => (
          <Chip key={activityScore.id} textStyle={styled.markText} style={styled.mark} mode={'flat'} compact>
            {activityScore.score}
          </Chip>
        ))}
      </View>
    </Card.Content>
  )
})
