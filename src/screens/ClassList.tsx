import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { RootStackScreenProps } from '../navigation/types'
import { Appbar, Card, MD3Theme, useTheme } from 'react-native-paper'
import { InteractionManager, RefreshControl, ScrollView, StyleSheet } from 'react-native'
import { useStore } from '../shared/hooks/useStore'
import { PageContainer } from '../components/PageContainer'
import { clearStorageItem } from '../shared/storage'

export const ClassList = memo((props: RootStackScreenProps<'ClassList'>) => {
  const theme = useTheme()

  const fetchClasses = useStore(state => state.fetch)
  const classes = useStore(state => state.classes)
  const isStoreLoading = useStore(state => state.isLoading)
  const isInitialized = useStore(state => state.isInitialized)

  const logout = useStore(state => state.logout)

  const [isScreenInitialized, setScreenInitialized] = useState(false)

  const isLoading = useMemo(() => !isScreenInitialized || isStoreLoading, [isScreenInitialized, isStoreLoading])

  const handleRefresh = useCallback(() => !isStoreLoading && fetchClasses(), [isStoreLoading, fetchClasses])

  const handleLogout = useCallback(() => {
    logout()
    clearStorageItem('auth-token').then()
  }, [logout])

  const handleNavigate = useCallback(
    (id: number) => () => {
      props.navigation.navigate('Class', {
        id: id,
      })
    },
    [props.navigation]
  )

  useEffect(() => {
    if (!isInitialized) {
      fetchClasses()
    }
  }, [fetchClasses, isInitialized])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setScreenInitialized(true)
    })
  }, [])

  const styles = useMemo(() => makeStyles(theme), [theme])

  const CardList = useMemo(
    () =>
      Object.keys(classes)
        .map((id: string) => {
          const classId = parseInt(id)
          return classes[classId]
        })
        .sort((a, b) =>
          a.schoolYear < b.schoolYear ? -1 : a.schoolYear > b.schoolYear ? 1 : a.label.localeCompare(b.label)
        )
        .map(class_ => {
          return (
            <Card key={class_.id} style={styles.card} elevation={1} onPress={handleNavigate(class_.id)}>
              <Card.Title
                title={`${class_.schoolYear}${class_.label}`}
                subtitle={class_.school.name}
                titleVariant={'titleLarge'}
              />
            </Card>
          )
        }),
    [classes, handleNavigate, styles.card]
  )

  return (
    <PageContainer refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Clase" color={theme.colors.onPrimary} />
        <Appbar.Action icon="logout" onPress={handleLogout} color={theme.colors.onPrimary} />
      </Appbar.Header>

      {/*{isLoading && <ActivityIndicator animating={true} />}*/}

      {!isLoading && <ScrollView style={styles.cards}>{CardList}</ScrollView>}
    </PageContainer>
  )
})

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    appbar: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.inversePrimary,
    },
    cards: {
      paddingTop: 20,
      paddingHorizontal: 10,
    },
    card: {
      marginBottom: 15,
      padding: 10,
    },
  })
