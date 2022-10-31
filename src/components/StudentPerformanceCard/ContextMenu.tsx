import { Divider, IconButton, MD3Theme, Menu, MenuProps, useTheme } from 'react-native-paper'
import React, { useMemo, memo } from 'react'
import { StyleSheet } from 'react-native'

interface ContextMenuProps extends Pick<MenuProps, 'visible' | 'onDismiss'> {
  onAddMissingHomework?: () => void
  onDeleteMissingHomework?: () => void
  isDeleteMissingHomeworkDisabled?: boolean

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

    onAddMissingHomework,
    onDeleteMissingHomework,
    isDeleteMissingHomeworkDisabled,

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
        anchor={<IconButton icon="dots-vertical" mode={undefined} onPress={onDismiss} />}
      >
        <Menu.Item onPress={onAddMissingHomework} title="Adauga tema nefacuta" />
        <Menu.Item
          onPress={onDeleteMissingHomework}
          disabled={isDeleteMissingHomeworkDisabled}
          title="Sterge tema nefacuta"
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
