import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { RootStackScreenProps } from '../navigation/types'
import { ActivityIndicator, Appbar, MD3Theme, Text, useTheme } from 'react-native-paper'
import { RefreshControl, ScrollView, StyleSheet, TextInput } from 'react-native'
import { useClassStore } from '../stores/classStore'
import { StudentPerformanceCard } from '../components/StudentPerformanceCard'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export const Class = (props: RootStackScreenProps<'Class'>) => {
  const theme = useTheme()

  const id = useMemo(
    // @ts-ignore
    () => (props.route?.params?.id ? parseInt(props.route?.params?.id) : undefined),
    [props.route?.params]
  )

  const fetchClass = useClassStore(state => state.fetchById)
  const class_ = useClassStore(state => (id ? state.classes[id] : undefined))
  const isLoading = useClassStore(state => state.isLoading)

  const areDetailsLoaded = useMemo(() => class_?.studentsPerformance, [class_?.studentsPerformance])

  const [isSearching, setSearching] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearchingChange = useCallback(
    (enabled: boolean) => () => {
      setSearching(enabled)
    },
    []
  )

  const handleSearchKeywordChange = useCallback(value => setSearchKeyword(value), [])

  const studentsPerformance = useMemo(() => {
    return isSearching
      ? class_?.studentsPerformance?.filter(
          studentPerformance =>
            studentPerformance.student.firstName.includes(searchKeyword) ||
            studentPerformance.student.lastName.includes(searchKeyword)
        )
      : class_?.studentsPerformance
  }, [class_?.studentsPerformance, isSearching, searchKeyword])

  const handleRefresh = useCallback(() => id && fetchClass(id), [fetchClass, id])

  useEffect(() => {
    if (id && !areDetailsLoaded) {
      fetchClass(id)
    }
  }, [fetchClass, id, areDetailsLoaded])

  useEffect(() => {
    if (!isSearching) {
      setSearchKeyword('')
    }
  }, [isSearching])

  const styles = makeStyles(theme)

  return (
    <ScrollView
      key={id}
      style={styles.surface}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
    >
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          color={theme.colors.onPrimary}
          onPress={() => props.navigation.navigate('Root', { screen: 'ClassList' })}
        />
        {!class_ && isLoading && (
          <Appbar.Content title={<ActivityIndicator animating={true} color={theme.colors.onPrimary} />} />
        )}

        {(!isLoading || class_) && !isSearching && (
          <Appbar.Content
            color={theme.colors.onPrimary}
            title={`Clasa ${class_?.schoolYear}${class_?.label}`}
            subtitle={class_?.school}
          />
        )}
        {(!isLoading || class_) && !isSearching && (
          <Appbar.Action color={theme.colors.onPrimary} icon="magnify" onPress={handleSearchingChange(true)} />
        )}

        {(!isLoading || class_) && isSearching && (
          <Icon name="magnify" size={24} color={theme.colors.onPrimary} style={styles.searchingIcon} />
        )}
        {(!isLoading || class_) && isSearching && (
          <TextInput
            value={searchKeyword}
            //left={<TextInput.Icon icon="magnify" color={theme.colors.onPrimary} />}
            onChangeText={handleSearchKeywordChange}
            placeholder={'Search students'}
            style={styles.searchbar}
            placeholderTextColor={theme.colors.onPrimary}
            selectionColor={theme.colors.onPrimary}
          />
        )}
        {(!isLoading || class_) && isSearching && (
          <Appbar.Action color={theme.colors.onPrimary} icon="close" onPress={handleSearchingChange(false)} />
        )}
      </Appbar.Header>

      {isLoading && <ActivityIndicator style={styles.refreshIndicator} animating={true} />}

      {!isLoading && (
        <ScrollView style={styles.cards}>
          {studentsPerformance?.map(studentPerformance => (
            <StudentPerformanceCard
              key={studentPerformance.id}
              studentPerformance={studentPerformance}
              onPress={() => props.navigation.navigate('Root', { screen: 'ClassList' })}
            />
          ))}
          {areDetailsLoaded && !studentsPerformance?.length && (
            <Text variant="bodyLarge">Aceasta clasa nu are elevi adaugati.</Text>
          )}
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
    cards: {
      paddingTop: 20,
      paddingHorizontal: 10,
    },
    appbar: {
      backgroundColor: theme.colors.primary,
    },
    searchbar: {
      color: theme.colors.onPrimary,
      backgroundColor: 'transparent',
      flexGrow: 1,
      fontSize: 18,
    },
    refreshIndicator: {
      marginTop: 20,
    },
    searchingIcon: {
      marginRight: 10,
    },
  })
