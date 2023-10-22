import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Class, selectIsLoading, selectLastAcademicYear, useStore } from '@essar05/student-manager-core'
import { FlatList, InteractionManager, ListRenderItem, RefreshControl, View } from 'react-native'
import { Appbar, Card, Text, useTheme } from 'react-native-paper'

import { RootStackScreenProps } from '../../navigation/types'
import { useStyles } from '../../shared/hooks/useStyles'
import { clearStorageItem } from '../../shared/storage'
import { styles } from './ClassList.styles'

export const ClassList = memo(({ navigation: { navigate } }: RootStackScreenProps<'ClassList'>) => {
  const theme = useTheme()

  const lastYear = useStore(selectLastAcademicYear)
  const yearId = lastYear?.id

  const yearLabel = lastYear?.year ? `${lastYear.year} - ${lastYear.year + 1}` : '---'

  const fetchClasses = useStore(state => state.classes.actions.fetchAll)
  const classes = useStore(state => state.classes.records)
  const classesOrder = useStore(state => state.classes.order)
  const isStoreLoading = useStore(selectIsLoading('class'))

  const logout = useStore(state => state.auth.actions.logout)

  const [isScreenInitialized, setScreenInitialized] = useState(false)

  const isLoading = useMemo(() => !isScreenInitialized || isStoreLoading, [isScreenInitialized, isStoreLoading])

  const handleRefresh = useCallback(() => !isStoreLoading && fetchClasses(), [isStoreLoading, fetchClasses])

  const handleLogout = useCallback(() => {
    logout()
    clearStorageItem('auth-token').then()
  }, [logout])

  const handleNavigate = useCallback(
    (id: number) => () => {
      navigate('Class', {
        id,
      })
    },
    [navigate]
  )

  useEffect(() => {
    fetchClasses(yearId)
  }, [fetchClasses, yearId])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setScreenInitialized(true)
    })
  }, [])

  const styled = useStyles(styles)

  const classList = useMemo(
    () =>
      classesOrder.map((id: number) => {
        return classes[id]
      }),
    [classes, classesOrder, handleNavigate, styled.card]
  )

  const renderCard = useCallback<ListRenderItem<Class>>(
    ({ item }) => (
      <Card key={item.id} style={styled.card} elevation={1} onPress={handleNavigate(item.id)}>
        <Card.Title title={`${item.schoolYear}${item.label}`} subtitle={item.school.name} titleVariant={'titleLarge'} />
      </Card>
    ),
    [handleNavigate, styled.card]
  )

  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
      stickyHeaderIndices={[0]}
      style={{
        height: '100%',
      }}
      ListHeaderComponent={
        <View style={styled.header}>
          <Appbar.Header style={styled.appbar}>
            <Appbar.Content
              title={
                <>
                  <Text style={styled.appbarTitle}>{'Clase'}</Text>
                  <Text style={styled.appbarSubtitle}>{yearLabel}</Text>
                </>
              }
              color={theme.colors.onPrimary}
            />
            <Appbar.Action icon="logout" onPress={handleLogout} color={theme.colors.onPrimary} />
          </Appbar.Header>
        </View>
      }
      ListEmptyComponent={
        <>
          <Text variant="bodyLarge">Nu au fost gasite clase.</Text>
        </>
      }
      refreshing={isLoading}
      keyboardShouldPersistTaps="always"
      data={classList}
      renderItem={renderCard}
      keyExtractor={item => item.id.toString()}
    />
  )
})
