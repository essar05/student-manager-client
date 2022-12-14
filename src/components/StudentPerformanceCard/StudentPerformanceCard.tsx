import React, { memo, useCallback, useMemo, useState } from 'react'
import { Card, Divider, Text, useTheme } from 'react-native-paper'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StudentPerformance } from '../../shared/store/models/studentPerformance'
import { useStore } from '../../shared/hooks/useStore'
import { Actions } from './Actions'
import { InfoCell } from './InfoCell'
import { MarksCell } from './MarksCell'
import { ContextMenu } from './ContextMenu'

export interface StudentPerformanceCardProps {
  studentPerformance: StudentPerformance

  isVisible?: boolean
  isCompact?: boolean

  onPress?: () => void
}

export const StudentPerformanceCard = memo(
  ({ studentPerformance, isVisible = true, isCompact }: StudentPerformanceCardProps) => {
    const theme = useTheme()

    const [isMenuVisible, setMenuVisible] = useState(false)

    const addActivityScore = useStore(state => state.addActivityScore)
    const deleteActivityScore = useStore(state => state.deleteActivityScore)
    const addActivityPoints = useStore(state => state.addActivityPoints)
    const addMissingHomework = useStore(state => state.addMissingHomework)
    const deleteLastMissingHomework = useStore(state => state.deleteLastMissingHomework)
    const addLoudnessWarning = useStore(state => state.addLoudnessWarning)
    const deleteLastLoudnessWarning = useStore(state => state.deleteLastLoudnessWarning)

    const handleAddMark = useCallback(
      (mark: number) => () => {
        addActivityScore(studentPerformance.classId, studentPerformance.id, mark)
      },
      [addActivityScore, studentPerformance.classId, studentPerformance.id]
    )

    const handleDeleteLastMark = useCallback(() => {
      const lastActivityScoreId = studentPerformance.activityScores?.[studentPerformance.activityScores.length - 1]?.id

      if (lastActivityScoreId) {
        deleteActivityScore(studentPerformance.classId, studentPerformance.id, lastActivityScoreId)

        setMenuVisible(false)
      }
    }, [deleteActivityScore, studentPerformance.activityScores, studentPerformance.classId, studentPerformance.id])

    const handleUpVote = useCallback(async () => {
      addActivityPoints(studentPerformance.classId, studentPerformance.id, 1)
    }, [addActivityPoints, studentPerformance.classId, studentPerformance.id])

    const handleDownVote = useCallback(() => {
      addActivityPoints(studentPerformance.classId, studentPerformance.id, -1)
    }, [addActivityPoints, studentPerformance.classId, studentPerformance.id])

    const handleAddMissingHomework = useCallback(
      (amount: number) => () => {
        addMissingHomework(studentPerformance.classId, studentPerformance.id, amount)

        setMenuVisible(false)
      },
      [addMissingHomework, studentPerformance.classId, studentPerformance.id]
    )

    const handleDeleteMissingHomework = useCallback(() => {
      deleteLastMissingHomework(studentPerformance.classId, studentPerformance.id)

      setMenuVisible(false)
    }, [deleteLastMissingHomework, studentPerformance.classId, studentPerformance.id])

    const handleAddLoudnessWarning = useCallback(() => {
      addLoudnessWarning(studentPerformance.classId, studentPerformance.id)

      setMenuVisible(false)
    }, [addLoudnessWarning, studentPerformance.classId, studentPerformance.id])

    const handleDeleteLoudnessWarning = useCallback(() => {
      deleteLastLoudnessWarning(studentPerformance.classId, studentPerformance.id)

      setMenuVisible(false)
    }, [deleteLastLoudnessWarning, studentPerformance.classId, studentPerformance.id])

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

    const cardStyle = useMemo(
      () => StyleSheet.compose<ViewStyle>(styles.card, !isVisible ? styles.hidden : undefined),
      [isVisible]
    )

    const title = useMemo(
      () => (
        <Text>
          <Text style={styles.boldText}>{studentPerformance.student.lastName}</Text>{' '}
          {studentPerformance.student.firstName}
        </Text>
      ),
      [studentPerformance.student.firstName, studentPerformance.student.lastName]
    )

    const subtitle = useMemo(
      () =>
        isCompact ? (
          <>
            <Icon name={'school'} color={theme.colors.primary} />
            &nbsp;{averageActivityScore || '-'}&nbsp;&nbsp;
            <Icon name={'thumbs-up-down'} color={theme.colors.primary} />
            &nbsp;
            {studentPerformance.activityPoints || 0}&nbsp;&nbsp;
            <Icon name={'book-off'} color={theme.colors.primary} />
            &nbsp;
            {studentPerformance.missingHomeworks || 0}&nbsp;&nbsp;
            <Icon name={'volume-high'} color={theme.colors.primary} />
            &nbsp;
            {studentPerformance.loudnessWarnings || 0}
          </>
        ) : undefined,
      [
        averageActivityScore,
        isCompact,
        studentPerformance.activityPoints,
        studentPerformance.loudnessWarnings,
        studentPerformance.missingHomeworks,
        theme.colors.primary,
      ]
    )

    const renderContextMenu = useCallback(
      () => (
        <ContextMenu
          visible={isMenuVisible}
          onDismiss={() => setMenuVisible(false)}
          onOpen={() => setMenuVisible(true)}
          onAddMissingHomework={handleAddMissingHomework}
          onDeleteMissingHomework={handleDeleteMissingHomework}
          isDeleteMissingHomeworkDisabled={
            !studentPerformance.missingHomeworks || studentPerformance.missingHomeworks < 1
          }
          isDeleteHalfMissingHomeworkDisabled={!studentPerformance.missingHomeworks}
          onAddLoudnessWarning={handleAddLoudnessWarning}
          onDeleteLoudnessWarning={handleDeleteLoudnessWarning}
          isDeleteLoudnessWarningDisabled={!studentPerformance.loudnessWarnings}
          onDeleteLastMark={handleDeleteLastMark}
          isDeleteLastMarkDisabled={!studentPerformance.activityScores?.length}
        />
      ),
      [
        handleAddLoudnessWarning,
        handleAddMissingHomework,
        handleDeleteLastMark,
        handleDeleteLoudnessWarning,
        handleDeleteMissingHomework,
        isMenuVisible,
        studentPerformance.activityScores?.length,
        studentPerformance.loudnessWarnings,
        studentPerformance.missingHomeworks,
      ]
    )

    const [isActionsEnabled, setActionsEnabled] = useState(false)
    const handleToggleActionsEnabled = useCallback(() => setActionsEnabled(enabled => !enabled), [])

    return (
      <Card key={studentPerformance.id} style={cardStyle} elevation={1}>
        <Pressable onPress={handleToggleActionsEnabled}>
          <Card.Title
            title={title}
            subtitle={subtitle}
            titleNumberOfLines={3}
            titleVariant={'titleLarge'}
            subtitleVariant={'bodyLarge'}
            rightStyle={styles.titleRight}
            right={renderContextMenu}
            style={styles.cardTitle}
            titleStyle={styles.cardTitleTitle}
            subtitleStyle={!isCompact ? { height: 0 } : undefined}
          />
        </Pressable>

        {!!studentPerformance.activityScores?.length && (
          <>
            <Divider />

            <MarksCell
              isCompact={isCompact}
              style={styles.cardContent}
              labelStyle={styles.cardContentLabel}
              activityScores={studentPerformance.activityScores}
            />
          </>
        )}

        <Divider />

        {!isCompact && (
          <View style={styles.cardContentVertical}>
            <InfoCell
              style={styles.cardContent}
              labelStyle={styles.cardContentLabel}
              label="Nota finala"
              value={averageActivityScore || '-'}
              icon="school"
            />
            <InfoCell
              style={styles.cardContent}
              labelStyle={styles.cardContentLabel}
              label="Puncte"
              value={studentPerformance.activityPoints || 0}
              icon="thumbs-up-down"
            />
            <InfoCell
              style={styles.cardContent}
              labelStyle={styles.cardContentLabel}
              label="Teme nefacute"
              value={studentPerformance.missingHomeworks || 0}
              icon="book-off"
            />
            <InfoCell
              style={styles.cardContent}
              labelStyle={styles.cardContentLabel}
              label="Zgomot"
              value={studentPerformance.loudnessWarnings || 0}
              icon="volume-high"
            />
          </View>
        )}

        {!isCompact && <Divider />}

        {(isActionsEnabled || !isCompact) && (
          <Actions handleAddMark={handleAddMark} handleUpVote={handleUpVote} handleDownVote={handleDownVote} />
        )}
      </Card>
    )
  }
)

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 0,
  },
  hidden: {
    display: 'none',
    marginBottom: 0,
  },
  cardTitle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    paddingLeft: 15,
    minHeight: 70,
  },
  cardTitleTitle: {
    padding: 0,
    margin: 0,
  },
  cardContentVertical: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
  },
  cardContentLabel: {
    flexShrink: 1,
    overflow: 'hidden',
    marginLeft: 4,
    marginBottom: 5,
  },
  cardContent: {
    padding: 10,
  },
  titleRight: {},
  avgMark: {
    backgroundColor: '#1d83c4',
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },
  menuDivider: {
    // backgroundColor: theme.colors.surface,
  },
})
