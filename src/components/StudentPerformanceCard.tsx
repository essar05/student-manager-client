import React, { useCallback, useMemo, useState } from 'react'
import { Button, Card, Chip, Divider, IconButton, MD3Theme, Menu, Text, useTheme } from 'react-native-paper'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { negativeColor, positiveColor } from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StudentPerformance } from '../models/studentPerformance'
import { useClassStore } from '../stores/classStore'

export interface StudentPerformanceCardProps {
  studentPerformance: StudentPerformance

  onPress: () => void
}

export const StudentPerformanceCard = ({ studentPerformance, onPress }: StudentPerformanceCardProps) => {
  const theme = useTheme()

  const [isMenuVisible, setMenuVisible] = useState(false)

  const addActivityScore = useClassStore(state => state.addActivityScore)
  const addActivityPoints = useClassStore(state => state.addActivityPoints)
  const addMissingHomework = useClassStore(state => state.addMissingHomework)
  const addLoudnessWarning = useClassStore(state => state.addLoudnessWarning)

  const handleAddMark = useCallback(
    (mark: number) => () => {
      addActivityScore(studentPerformance.classId, studentPerformance.id, mark)
    },
    [addActivityScore, studentPerformance.classId, studentPerformance.id]
  )

  const handleUpVote = useCallback(() => {
    addActivityPoints(studentPerformance.classId, studentPerformance.id, 1)
  }, [addActivityPoints, studentPerformance.classId, studentPerformance.id])

  const handleDownVote = useCallback(() => {
    addActivityPoints(studentPerformance.classId, studentPerformance.id, -1)
  }, [addActivityPoints, studentPerformance.classId, studentPerformance.id])

  const handleAddMissingHomework = useCallback(() => {
    addMissingHomework(studentPerformance.classId, studentPerformance.id)

    setMenuVisible(false)
  }, [addMissingHomework, studentPerformance.classId, studentPerformance.id])

  const handleAddLoudnessWarning = useCallback(() => {
    addLoudnessWarning(studentPerformance.classId, studentPerformance.id)

    setMenuVisible(false)
  }, [addLoudnessWarning, studentPerformance.classId, studentPerformance.id])

  const averageActivityScore = useMemo(() => {
    return studentPerformance.activityScores && studentPerformance.activityScores.length > 0
      ? (
          studentPerformance.activityScores.reduce(
            (accumulator, activityScore) => accumulator + activityScore.score,
            0
          ) / studentPerformance.activityScores.length
        ).toFixed(2)
      : null
  }, [studentPerformance.activityScores])

  const styles = makeStyles(theme)
  const actionRightStyle = StyleSheet.compose<ViewStyle>(styles.action, styles.actionRight)
  const actionsBottomStyle = StyleSheet.compose<ViewStyle>(styles.actions, styles.actionsBottom)
  const cardContentCellStyle = StyleSheet.compose<ViewStyle>(styles.cardContent, styles.cardContentCell)

  return (
    <Card key={studentPerformance.id} style={styles.card} elevation={1}>
      <Card.Title
        title={`${studentPerformance.student.firstName} ${studentPerformance.student.lastName}`}
        titleNumberOfLines={2}
        titleVariant={'titleLarge'}
        rightStyle={styles.titleRight}
        right={() => (
          <>
            <Menu
              contentStyle={styles.menu}
              visible={isMenuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<IconButton icon="dots-vertical" mode={undefined} onPress={() => setMenuVisible(true)} />}
            >
              <Menu.Item onPress={handleAddMissingHomework} title="Adauga tema nefacuta" />
              <Menu.Item onPress={() => {}} title="Sterge tema nefacuta" />

              <Divider bold style={styles.menuDivider} />

              <Menu.Item onPress={handleAddLoudnessWarning} title="Adauga punct zgomot" />
              <Menu.Item onPress={() => {}} title="Sterge punct zgomot" />

              <Divider bold style={styles.menuDivider} />

              <Menu.Item onPress={() => {}} title="Sterge ultima nota" />

              <Divider bold style={styles.menuDivider} />

              <Menu.Item onPress={() => {}} title="Vezi detalii" />
            </Menu>
          </>
        )}
      />

      {!!studentPerformance.activityScores?.length && (
        <>
          <Divider />

          <Card.Content style={styles.cardContent}>
            <Text variant={'labelLarge'} style={styles.cardContentLabel}>
              Note activitate
            </Text>

            <View style={styles.marks}>
              {studentPerformance.activityScores.map((activityScore, index) => (
                <Chip key={index} textStyle={styles.markText} style={styles.mark} mode={'flat'} compact>
                  {activityScore.score}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </>
      )}

      <Divider />

      <View style={styles.cardContentVertical}>
        <Card.Content style={cardContentCellStyle}>
          <Text variant={'labelLarge'} style={styles.cardContentLabel}>
            Nota finala
          </Text>

          <View style={styles.marks}>
            <Chip compact mode={'flat'} icon="school">
              {averageActivityScore || '-'}
            </Chip>
          </View>
        </Card.Content>

        <Card.Content style={cardContentCellStyle}>
          <Text variant={'labelLarge'} style={styles.cardContentLabel}>
            Puncte
          </Text>

          <View style={styles.marks}>
            <Chip compact mode={'flat'} icon="thumbs-up-down">
              {studentPerformance.activityPoints || 0}
            </Chip>
          </View>
        </Card.Content>

        <Card.Content style={cardContentCellStyle}>
          <Text variant={'labelLarge'} style={styles.cardContentLabel}>
            Teme nefacute
          </Text>

          <View style={styles.marks}>
            <Chip compact mode={'flat'} icon="book-off">
              {studentPerformance.missingHomeworks || 0}
            </Chip>
          </View>
        </Card.Content>

        <Card.Content style={cardContentCellStyle}>
          <Text variant={'labelLarge'} style={styles.cardContentLabel}>
            Zgomot
          </Text>

          <View style={styles.marks}>
            <Chip compact mode={'flat'} icon="volume-high">
              {studentPerformance.loudnessWarnings || 0}
            </Chip>
          </View>
        </Card.Content>
      </View>

      <Divider />

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
    </Card>
  )
}

const MARKS = Array(10)
  .fill(0)
  .map((_, index) => index + 1)

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      marginBottom: 15,
      padding: 0,
    },
    cardContentVertical: {
      display: 'flex',
      flexDirection: 'row',
      paddingRight: 10,
      paddingLeft: 10,
    },
    cardContentCell: {
      paddingRight: 0,
      paddingLeft: 5,
      flexShrink: 1,
      flexGrow: 1,
    },
    cardContentLabel: {
      marginLeft: 4,
      marginBottom: 5,
    },
    cardContent: {
      padding: 10,
    },
    titleRight: {},
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
    avgMark: {
      backgroundColor: '#1d83c4',
      color: '#fff',
    },
    menu: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    menuDivider: {
      backgroundColor: theme.colors.surface,
    },
  })