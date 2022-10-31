import React, { memo, useMemo } from 'react'
import { Card, Chip, Text } from 'react-native-paper'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { ActivityScore } from '../../shared/store/models/activityScore'

interface MarksCellProps {
  style: ViewStyle
  labelStyle: TextStyle

  activityScores?: ActivityScore[]
}

export const MarksCell = memo(({ style, labelStyle, activityScores }: MarksCellProps) => {
  const sortedActivityScores = useMemo(
    () =>
      activityScores
        ? [...activityScores]?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : undefined,
    []
  )

  return (
    <Card.Content style={style}>
      <Text variant={'labelLarge'} style={labelStyle}>
        Note activitate
      </Text>

      <View style={styles.marks}>
        {sortedActivityScores?.map((activityScore, index) => (
          <Chip key={activityScore.id} textStyle={styles.markText} style={styles.mark} mode={'flat'} compact>
            {activityScore.score}
          </Chip>
        ))}
      </View>
    </Card.Content>
  )
})

const styles = StyleSheet.create({
  marks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mark: {
    margin: 2,
    minWidth: 31,
  },
  markText: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})
