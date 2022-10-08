import React, { useEffect } from 'react'
import { RootStackScreenProps } from '../navigation/types'
import { ActivityIndicator, Appbar, Card, MD3Theme, useTheme } from 'react-native-paper'
import { useClassStore } from '../stores/classStore'
import { ScrollView, StyleSheet } from 'react-native'

export const ClassList = (props: RootStackScreenProps<'ClassList'>) => {
  const theme = useTheme()

  const fetchClasses = useClassStore(state => state.fetch)
  const classes = useClassStore(state => state.classes)
  const isLoading = useClassStore(state => state.isLoading)
  const isInitialized = useClassStore(state => state.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      fetchClasses()
    }
  }, [fetchClasses, isInitialized])

  const styles = makeStyles(theme)

  return (
    <ScrollView style={styles.surface}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Clase" color={theme.colors.onPrimary} />
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
    </ScrollView>
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
