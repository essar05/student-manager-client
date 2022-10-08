import React, { useCallback, useEffect } from 'react'
import { RootStackScreenProps } from '../navigation/types'
import { ActivityIndicator, Appbar, Card, MD3Theme, useTheme } from 'react-native-paper'
import { ScrollView, StyleSheet } from 'react-native'
import { useStore } from '../shared/hooks/useStore'
import { PageContainer } from '../components/PageContainer'
import { clearStorageItem } from '../shared/storage'

export const ClassList = (props: RootStackScreenProps<'ClassList'>) => {
  const theme = useTheme()

  const fetchClasses = useStore(state => state.fetch)
  const classes = useStore(state => state.classes)
  const isLoading = useStore(state => state.isLoading)
  const isInitialized = useStore(state => state.isInitialized)

  const logout = useStore(state => state.logout)

  const handleLogout = useCallback(() => {
    logout()
    clearStorageItem("auth-token").then()
  }, [logout])

  useEffect(() => {
    if (!isInitialized) {
      fetchClasses()
    }
  }, [fetchClasses, isInitialized])

  const styles = makeStyles(theme)

  return (
    <PageContainer style={styles.surface}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Clase" color={theme.colors.onPrimary} />
        <Appbar.Action icon="logout" onPress={handleLogout} color={theme.colors.onPrimary} />
      </Appbar.Header>

      {isLoading && <ActivityIndicator animating={true} />}

      {!isLoading && (
        <ScrollView style={styles.cards}>
          {Object.keys(classes).map((id: string) => {
            const classId = parseInt(id)
            const class_ = classes[classId]

            return (
              <Card
                key={id}
                style={styles.card}
                elevation={1}
                onPress={() => props.navigation.navigate('Root', { screen: 'Class', params: { id: class_.id } })}
              >
                <Card.Title title={`${class_.schoolYear}${class_.label}`} subtitle={class_.school.name} titleVariant={'titleLarge'} />
              </Card>
            )
          })}
        </ScrollView>
      )}
    </PageContainer>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    surface: {
      flex: 1,
      minHeight: '100%',
      backgroundColor: theme.colors.background,
    },
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
