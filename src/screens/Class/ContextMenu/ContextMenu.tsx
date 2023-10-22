import { memo } from 'react'
import { Divider, IconButton, Menu, MenuProps, useTheme } from 'react-native-paper'

import { useStyles } from '../../../shared/hooks/useStyles'
import { styles } from './ContextMenu.styles'

interface ContextMenuProps extends Pick<MenuProps, 'visible' | 'onDismiss'> {
  onOpen: () => void

  isCompact?: boolean
  onToggleCompact: () => void

  semester?: 1 | 2
  onSemester1Select: () => void
  onSemester2Select: () => void
}

export const ContextMenu = memo(
  ({
    visible,
    onDismiss,

    onOpen,

    isCompact,
    onToggleCompact,

    semester,

    onSemester1Select,
    onSemester2Select,
  }: ContextMenuProps) => {
    const styled = useStyles(styles)
    const theme = useTheme()

    return (
      <Menu
        contentStyle={styled.menu}
        visible={visible}
        onDismiss={onDismiss}
        anchor={
          <IconButton
            iconColor={theme.colors.inverseOnSurface}
            icon="dots-vertical"
            mode={undefined}
            onPress={onOpen}
          />
        }
      >
        <Menu.Item onPress={onToggleCompact} title={isCompact ? 'Detaliat' : 'Compact'} />

        <Divider bold style={styled.menuDivider} />

        <Menu.Item onPress={onSemester1Select} disabled={semester === 1} title="Semestrul 1" />
        <Menu.Item onPress={onSemester2Select} disabled={semester === 2} title="Semestrul 2" />
      </Menu>
    )
  }
)
