import { memo, useCallback, useMemo, useState } from 'react'
import { StudentWithPerformance, useStore } from '@essar05/student-manager-core'
import { Pressable, View } from 'react-native'
import { Card, Divider, Text, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useStyles } from '../../shared/hooks/useStyles'
import { Actions } from './Actions/Actions'
import { ContextMenu } from './ContextMenu/ContextMenu'
import { InfoCell } from './InfoCell/InfoCell'
import { MarksCell } from './MarksCell/MarksCell'
import { styles } from './StudentCard.styles'

export interface StudentCardProps {
  classId: number
  semester: 1 | 2
  student: StudentWithPerformance

  isVisible?: boolean
  isCompact?: boolean

  onPress?: () => void
}

export const StudentCard = memo(({ classId, semester, student, isVisible = true, isCompact }: StudentCardProps) => {
  const theme = useTheme()

  const [isMenuVisible, setMenuVisible] = useState(false)

  const addActivityScore = useStore(state => state.students.actions.addActivityScore)
  const deleteActivityScore = useStore(state => state.students.actions.deleteActivityScore)
  const addActivityPoints = useStore(state => state.students.actions.addActivityPoints)
  const addMissingHomework = useStore(state => state.students.actions.addMissingHomework)
  const deleteLastMissingHomework = useStore(state => state.students.actions.deleteLastMissingHomework)
  const addLoudnessWarning = useStore(state => state.students.actions.addLoudnessWarning)
  const deleteLastLoudnessWarning = useStore(state => state.students.actions.deleteLastLoudnessWarning)

  const studentPerformance = student.performanceBySemester[semester]

  const handleAddMark = useCallback(
    (mark: number) => () => {
      addActivityScore({ classId, studentId: student.id, semester, score: mark })
    },
    [addActivityScore, classId, semester, student.id]
  )

  const handleDeleteLastMark = useCallback(() => {
    const lastActivityScoreId = studentPerformance?.activityScores?.[studentPerformance.activityScores.length - 1]?.id

    if (lastActivityScoreId) {
      deleteActivityScore({ classId, semester, studentId: student.id, id: lastActivityScoreId })

      setMenuVisible(false)
    }
  }, [deleteActivityScore, studentPerformance?.activityScores, student.id, semester, classId])

  const handleUpVote = useCallback(async () => {
    addActivityPoints({ classId, studentId: student.id, semester, points: 1 })
  }, [addActivityPoints, classId, semester, student.id])

  const handleDownVote = useCallback(() => {
    addActivityPoints({ classId, studentId: student.id, semester, points: -1 })
  }, [addActivityPoints, classId, semester, student.id])

  const handleAddMissingHomework = useCallback(
    (amount: number) => () => {
      addMissingHomework({ classId, studentId: student.id, semester, amount })

      setMenuVisible(false)
    },
    [addMissingHomework, classId, semester, student.id]
  )

  const handleDeleteMissingHomework = useCallback(() => {
    deleteLastMissingHomework({ classId, studentId: student.id, semester })

    setMenuVisible(false)
  }, [classId, deleteLastMissingHomework, semester, student.id])

  const handleAddLoudnessWarning = useCallback(() => {
    addLoudnessWarning({ classId, studentId: student.id, semester })

    setMenuVisible(false)
  }, [addLoudnessWarning, classId, semester, student.id])

  const handleDeleteLoudnessWarning = useCallback(() => {
    deleteLastLoudnessWarning({ classId, studentId: student.id, semester })

    setMenuVisible(false)
  }, [classId, deleteLastLoudnessWarning, semester, student.id])

  const averageActivityScore = useMemo(() => {
    return studentPerformance?.activityScores && studentPerformance.activityScores.length > 0
      ? (
          studentPerformance.activityScores.reduce(
            (accumulator, activityScore) => accumulator + activityScore.score,
            0
          ) / studentPerformance.activityScores.length
        ).toFixed(2)
      : null
  }, [studentPerformance?.activityScores])

  const renderContextMenu = useCallback(
    () => (
      <ContextMenu
        visible={isMenuVisible}
        onDismiss={() => setMenuVisible(false)}
        onOpen={() => setMenuVisible(true)}
        onAddMissingHomework={handleAddMissingHomework}
        onDeleteMissingHomework={handleDeleteMissingHomework}
        isDeleteMissingHomeworkDisabled={
          !studentPerformance?.missingHomeworks || studentPerformance.missingHomeworks < 1
        }
        isDeleteHalfMissingHomeworkDisabled={!studentPerformance?.missingHomeworks}
        onAddLoudnessWarning={handleAddLoudnessWarning}
        onDeleteLoudnessWarning={handleDeleteLoudnessWarning}
        isDeleteLoudnessWarningDisabled={!studentPerformance?.loudnessWarnings}
        onDeleteLastMark={handleDeleteLastMark}
        isDeleteLastMarkDisabled={!studentPerformance?.activityScores?.length}
      />
    ),
    [
      handleAddLoudnessWarning,
      handleAddMissingHomework,
      handleDeleteLastMark,
      handleDeleteLoudnessWarning,
      handleDeleteMissingHomework,
      isMenuVisible,
      studentPerformance?.activityScores?.length,
      studentPerformance?.loudnessWarnings,
      studentPerformance?.missingHomeworks,
    ]
  )

  const [isActionsEnabled, setActionsEnabled] = useState(false)
  const handleToggleActionsEnabled = useCallback(() => setActionsEnabled(enabled => !enabled), [])

  const styled = useStyles(styles)

  const cardStyle = useMemo(
    () => [styled.card, !isVisible ? styled.hidden : undefined],
    [isVisible, styled.card, styled.hidden]
  )

  const title = useMemo(
    () => (
      <Text>
        <Text style={styled.boldText}>{student.lastName}</Text> {student.firstName}
      </Text>
    ),
    [student.firstName, student.lastName, styled.boldText]
  )

  const subtitle = useMemo(
    () =>
      isCompact ? (
        <>
          <Icon name={'school'} color={theme.colors.primary} />
          &nbsp;{averageActivityScore || '-'}&nbsp;&nbsp;
          <Icon name={'thumbs-up-down'} color={theme.colors.primary} />
          &nbsp;
          {studentPerformance?.activityPoints || 0}&nbsp;&nbsp;
          <Icon name={'book-off'} color={theme.colors.primary} />
          &nbsp;
          {studentPerformance?.missingHomeworks || 0}&nbsp;&nbsp;
          <Icon name={'volume-high'} color={theme.colors.primary} />
          &nbsp;
          {studentPerformance?.loudnessWarnings || 0}
        </>
      ) : undefined,
    [
      averageActivityScore,
      isCompact,
      studentPerformance?.activityPoints,
      studentPerformance?.loudnessWarnings,
      studentPerformance?.missingHomeworks,
      theme.colors.primary,
    ]
  )

  return (
    <Card key={student.id} style={cardStyle} elevation={1}>
      <Pressable onPress={handleToggleActionsEnabled}>
        <Card.Title
          title={title}
          subtitle={subtitle}
          titleNumberOfLines={3}
          titleVariant={'titleLarge'}
          subtitleVariant={'bodyLarge'}
          rightStyle={styled.titleRight}
          right={renderContextMenu}
          style={styled.cardTitle}
          titleStyle={styled.cardTitleTitle}
          subtitleStyle={!isCompact ? { height: 0 } : undefined}
        />
      </Pressable>

      {!!studentPerformance?.activityScores?.length && (
        <>
          <Divider />

          <MarksCell
            isCompact={isCompact}
            style={styled.cardContent}
            labelStyle={styled.cardContentLabel}
            activityScores={studentPerformance.activityScores}
          />
        </>
      )}

      <Divider />

      {!isCompact && (
        <View style={styled.cardContentVertical}>
          <InfoCell
            style={styled.cardContent}
            labelStyle={styled.cardContentLabel}
            label="Nota finala"
            value={averageActivityScore || '-'}
            icon="school"
          />
          <InfoCell
            style={styled.cardContent}
            labelStyle={styled.cardContentLabel}
            label="Puncte"
            value={studentPerformance?.activityPoints || 0}
            icon="thumbs-up-down"
          />
          <InfoCell
            style={styled.cardContent}
            labelStyle={styled.cardContentLabel}
            label="Teme nefacute"
            value={studentPerformance?.missingHomeworks || 0}
            icon="book-off"
          />
          <InfoCell
            style={styled.cardContent}
            labelStyle={styled.cardContentLabel}
            label="Zgomot"
            value={studentPerformance?.loudnessWarnings || 0}
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
})
