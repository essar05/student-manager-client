import { memo } from 'react'
import { Divider, IconButton, Menu, MenuProps } from 'react-native-paper'

import { useStyles } from '../../../shared/hooks/useStyles'
import { styles } from './ContextMenu.styles'

interface ContextMenuProps extends Pick<MenuProps, 'visible' | 'onDismiss'> {
  onOpen: () => void

  onAddMissingHomework?: (amount: number) => () => void
  onDeleteMissingHomework?: () => void
  isDeleteMissingHomeworkDisabled?: boolean
  isDeleteHalfMissingHomeworkDisabled?: boolean

  onAddLoudnessWarning?: () => void
  onDeleteLoudnessWarning?: () => void
  isDeleteLoudnessWarningDisabled?: boolean

  onDeleteLastMark?: () => void
  isDeleteLastMarkDisabled?: boolean
}

export const ContextMenu = memo(
  ({
    visible,
    onDismiss,

    onOpen,

    onAddMissingHomework,
    isDeleteMissingHomeworkDisabled,
    isDeleteHalfMissingHomeworkDisabled,

    onDeleteLoudnessWarning,
    onAddLoudnessWarning,
    isDeleteLoudnessWarningDisabled,

    onDeleteLastMark,
    isDeleteLastMarkDisabled,
  }: ContextMenuProps) => {
    const styled = useStyles(styles)

    return (
      <Menu
        contentStyle={styled.menu}
        visible={visible}
        onDismiss={onDismiss}
        anchor={<IconButton icon="dots-vertical" mode={undefined} onPress={onOpen} />}
      >
        <Menu.Item onPress={onAddMissingHomework?.(1)} title="Adauga tema nefacuta" />
        <Menu.Item
          onPress={onAddMissingHomework?.(-1)}
          disabled={isDeleteMissingHomeworkDisabled}
          title="Sterge tema nefacuta"
        />

        <Divider bold style={styled.menuDivider} />

        <Menu.Item onPress={onAddMissingHomework?.(0.5)} title="Adauga 1/2 tema nefacuta" />
        <Menu.Item
          onPress={onAddMissingHomework?.(-0.5)}
          disabled={isDeleteHalfMissingHomeworkDisabled}
          title="Sterge 1/2 tema nefacuta"
        />

        <Divider bold style={styled.menuDivider} />

        <Menu.Item onPress={onAddLoudnessWarning} title="Adauga punct zgomot" />
        <Menu.Item
          onPress={onDeleteLoudnessWarning}
          disabled={isDeleteLoudnessWarningDisabled}
          title="Sterge punct zgomot"
        />

        <Divider bold style={styled.menuDivider} />

        <Menu.Item onPress={onDeleteLastMark} disabled={isDeleteLastMarkDisabled} title="Sterge ultima nota" />

        <Divider bold style={styled.menuDivider} />

        <Menu.Item onPress={() => {}} title="Vezi detalii" disabled />
      </Menu>
    )
  }
)
