import React, { memo, useMemo } from 'react'
import { Card, Chip, Text } from 'react-native-paper'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

interface InfoCellProps {
  style?: ViewStyle
  labelStyle?: TextStyle

  label: string
  value: string | number
  icon: string
}

export const InfoCell = memo(({ style, labelStyle, label, value, icon }: InfoCellProps) => {
  const cardContentCellStyle = useMemo(() => StyleSheet.compose<ViewStyle>(style, styles.cardContentCell), [style])
  return (
    <Card.Content style={cardContentCellStyle}>
      <Text variant={'labelLarge'} style={labelStyle}>
        {label}
      </Text>

      <View style={styles.value}>
        <Chip compact mode={'flat'} icon={icon}>
          {value}
        </Chip>
      </View>
    </Card.Content>
  )
})

const styles = StyleSheet.create({
  cardContentCell: {
    paddingRight: 0,
    paddingLeft: 5,
    flexShrink: 1,
    flexGrow: 1,
  },
  value: {

  },
})
