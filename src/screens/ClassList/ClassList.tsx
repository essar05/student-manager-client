import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Class, selectIsLoading, useStore } from '@essar05/student-manager-core'
import { InteractionManager, RefreshControl, ScrollView, View } from 'react-native'
import { Appbar, Card, useTheme } from 'react-native-paper'

import { PageContainer } from '../../components/PageContainer'
import { RootStackScreenProps } from '../../navigation/types'
import { useStyles } from '../../shared/hooks/useStyles'
import { clearStorageItem } from '../../shared/storage'
import { styles } from './ClassList.styles'

export const ClassList = memo(({ navigation: { navigate } }: RootStackScreenProps<'ClassList'>) => {
  const theme = useTheme()

  const yearId = 1
  const fetchClasses = useStore(state => state.classes.actions.fetchAll)
  const classes = useStore(state => state.classes.records)
  const classesOrder = useStore(state => state.classes.order)
  const isStoreLoading = useStore(selectIsLoading('class'))
  const isInitialized = useStore(state => state.ui.isInitialized)

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
    if (!isInitialized) {
      fetchClasses(yearId)
    }
  }, [fetchClasses, isInitialized, yearId])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setScreenInitialized(true)
    })
  }, [])

  const styled = useStyles(styles)

  const CardList = useMemo(
    () =>
      classesOrder
        .map((id: number) => {
          return classes[id]
        })
        .map((class_: Class) => {
          return (
            <Card key={class_.id} style={styled.card} elevation={1} onPress={handleNavigate(class_.id)}>
              <Card.Title
                title={`${class_.schoolYear}${class_.label}`}
                subtitle={class_.school.name}
                titleVariant={'titleLarge'}
              />
            </Card>
          )
        }),
    [classes, classesOrder, handleNavigate, styled.card]
  )

  return (
    <PageContainer
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
      stickyHeaderIndices={[0]}
    >
      <View>
        <Appbar.Header style={styled.appbar}>
          <Appbar.Content title="Clase" color={theme.colors.onPrimary} />
          <Appbar.Action icon="logout" onPress={handleLogout} color={theme.colors.onPrimary} />
        </Appbar.Header>
      </View>

      {/*{isLoading && <ActivityIndicator animating={true} />}*/}

      {!isLoading && <ScrollView style={styled.cards}>{CardList}</ScrollView>}
    </PageContainer>
  )
})
