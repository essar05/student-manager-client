import { Divider, IconButton, MD3Theme, Menu, MenuProps, useTheme } from 'react-native-paper'
import React, { useMemo, memo } from 'react'
import { StyleSheet } from 'react-native'

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
    onDeleteMissingHomework,
    isDeleteMissingHomeworkDisabled,
    isDeleteHalfMissingHomeworkDisabled,

    onDeleteLoudnessWarning,
    onAddLoudnessWarning,
    isDeleteLoudnessWarningDisabled,

    onDeleteLastMark,
    isDeleteLastMarkDisabled,
  }: ContextMenuProps) => {
    const theme = useTheme()
    const styles = useMemo(() => makeStyles(theme), [theme])

    return (
      <Menu
        contentStyle={styles.menu}
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

        <Divider bold style={styles.menuDivider} />

        <Menu.Item onPress={onAddMissingHomework?.(0.5)} title="Adauga 1/2 tema nefacuta" />
        <Menu.Item
          onPress={onAddMissingHomework?.(-0.5)}
          disabled={isDeleteHalfMissingHomeworkDisabled}
          title="Sterge 1/2 tema nefacuta"
        />

        <Divider bold style={styles.menuDivider} />

        <Menu.Item onPress={onAddLoudnessWarning} title="Adauga punct zgomot" />
        <Menu.Item
          onPress={onDeleteLoudnessWarning}
          disabled={isDeleteLoudnessWarningDisabled}
          title="Sterge punct zgomot"
        />

        <Divider bold style={styles.menuDivider} />

        <Menu.Item onPress={onDeleteLastMark} disabled={isDeleteLastMarkDisabled} title="Sterge ultima nota" />

        <Divider bold style={styles.menuDivider} />

        <Menu.Item onPress={() => {}} title="Vezi detalii" disabled />
      </Menu>
    )
  }
)

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    menu: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    menuDivider: {
      backgroundColor: theme.colors.surface,
    },
  })
