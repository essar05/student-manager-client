import { memo, useMemo } from 'react'
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Card, Chip, Text } from 'react-native-paper'

import { useStyles } from '../../../shared/hooks/useStyles'
import { styles } from './InfoCell.styles'

interface InfoCellProps {
  style?: ViewStyle
  labelStyle?: TextStyle

  label: string
  value: string | number
  icon: string
}

export const InfoCell = memo(({ style, labelStyle, label, value, icon }: InfoCellProps) => {
  const styled = useStyles(styles)

  const cardContentCellStyle = useMemo(
    () => StyleSheet.compose(style, styled.cardContentCell),
    [style, styled.cardContentCell]
  )

  return (
    <Card.Content style={cardContentCellStyle}>
      <Text numberOfLines={1} variant={'labelLarge'} style={labelStyle}>
        {label}
      </Text>

      <View style={styled.value}>
        <Chip compact mode={'flat'} icon={icon}>
          {value}
        </Chip>
      </View>
    </Card.Content>
  )
})
