import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RootStackScreenProps } from '../../navigation/types'
import { ActivityIndicator, Appbar, MD3Theme, Text, useTheme } from 'react-native-paper'
import {
  Dimensions,
  InteractionManager,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import { StudentPerformanceCard } from '../../components/StudentPerformanceCard/StudentPerformanceCard'
import { useStore } from '../../shared/hooks/useStore'
import { PageContainer } from '../../components/PageContainer'
import { getBestMatchIndex, normalizeText } from '../../shared/utils'
import { getStorageItem, setStorageItem } from '../../shared/storage'
import { animated, useSpring } from 'react-spring'

const HEADER_COLLAPSE_THRESHOLD = 40
const HEADER_EXPAND_THRESHOLD = 80

const AnimatedView = animated(View)

export const Class = memo((props: RootStackScreenProps<'Class'>) => {
  const theme = useTheme()

  const id = useMemo(
    // @ts-ignore
    () => (props.route?.params?.id ? parseInt(props.route?.params?.id) : undefined),
    [props.route?.params]
  )

  const fetchClass = useStore(state => state.fetchById)
  const class_ = useStore(state => (id ? state.classes[id] : undefined))
  const isStoreLoading = useStore(state => state.isLoading)

  const areDetailsLoaded = useMemo(() => class_?.studentsPerformance, [class_?.studentsPerformance])

  const [isScreenInitialized, setScreenInitialized] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isCompact, setCompact] = useState(false)
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)

  const isLoading = useMemo(() => !isScreenInitialized || isStoreLoading, [isScreenInitialized, isStoreLoading])
  const isClassLoaded = useMemo(() => !!class_, [class_])

  const studentsPerformance = useMemo(() => {
    const keyword = normalizeText(searchKeyword)

    return keyword !== ''
      ? class_?.studentsPerformance
          ?.map(sp => ({
            firstNameMatch: getBestMatchIndex(sp.student.firstName, keyword),
            lastNameMatch: getBestMatchIndex(sp.student.lastName, keyword),
            studentPerformance: sp,
          }))
          .filter(spf => spf.firstNameMatch > -1 || spf.lastNameMatch > -1)
          .sort((a, b) => {
            const matchIndexA =
              a.firstNameMatch === -1
                ? a.lastNameMatch
                : a.lastNameMatch === -1
                ? a.firstNameMatch
                : Math.min(a.firstNameMatch, a.lastNameMatch)
            const matchIndexB =
              b.firstNameMatch === -1
                ? b.lastNameMatch
                : b.lastNameMatch === -1
                ? b.firstNameMatch
                : Math.min(b.firstNameMatch, b.lastNameMatch)

            if (matchIndexA < matchIndexB) {
              return -1
            }

            if (matchIndexA > matchIndexB) {
              return 1
            }

            return 0
          })
          .map(spf => spf.studentPerformance)
      : class_?.studentsPerformance
  }, [class_?.studentsPerformance, searchKeyword])

  const handleSearchKeywordChange = useCallback(value => setSearchKeyword(value), [])

  const handleClearSearchKeyword = useCallback(() => handleSearchKeywordChange(''), [handleSearchKeywordChange])

  const handleToggleCompact = useCallback(
    () =>
      setCompact(isCompact => {
        setStorageItem('isStudentCardCompact', isCompact ? 'false' : 'true')

        return !isCompact
      }),
    []
  )

  const handleRefresh = useCallback(() => id && fetchClass(id), [fetchClass, id])

  const handleBack = useCallback(() => props.navigation.navigate('ClassList'), [props.navigation])

  const previousScrollOffset = useRef<number | null>(null)

  const handleScrollEvent = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setContentHeight(event.nativeEvent.contentSize.height)

    const offset = event.nativeEvent.contentOffset.y
    const isScrollingUp = previousScrollOffset.current && previousScrollOffset.current > offset

    const isHeaderCollapsed = !isScrollingUp ? offset > HEADER_COLLAPSE_THRESHOLD : offset > HEADER_EXPAND_THRESHOLD

    setHeaderCollapsed(isHeaderCollapsed)
    previousScrollOffset.current = offset
  }, [])

  const isHeaderCollapsingEnabled = useMemo(() => {
    return contentHeight - Dimensions.get('screen').height > 200
  }, [contentHeight])

  const title = useMemo(() => `Clasa ${class_?.schoolYear}${class_?.label}`, [class_?.label, class_?.schoolYear])
  const subtitle = useMemo(() => class_?.school.name, [class_?.school.name])

  const [topHeaderHeight, setTopHeaderHeight] = useState<number | null>(null)

  const topHeaderAnimation = useSpring({
    height: isHeaderCollapsed && isHeaderCollapsingEnabled ? 0 : topHeaderHeight || 0,
    config: { mass: 1, tension: 510, friction: 40 },
    immediate: topHeaderHeight === null,
  })

  useEffect(() => {
    if (id && !areDetailsLoaded) {
      fetchClass(id)
    }
  }, [fetchClass, id, areDetailsLoaded])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setScreenInitialized(true)
    })
  }, [])

  useEffect(() => {
    const init = async () => {
      const isCompact = (await getStorageItem('isStudentCardCompact')) === 'true' || false

      setCompact(isCompact)
    }

    init()
  }, [])

  const styles = useMemo(() => makeStyles(theme), [theme])

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />,
    [handleRefresh, isLoading]
  )

  const topHeaderStyles = useMemo(
    () => StyleSheet.compose<ViewStyle>(styles.appbar, styles.appbarTop),
    [styles.appbar, styles.appbarTop]
  )

  // OVERKILL !??
  const cards = useMemo(() => {
    return class_?.studentsPerformance?.map(sp => ({
      id: sp.id,
      JSX: <StudentPerformanceCard key={sp.id} studentPerformance={sp} isCompact={isCompact} />,
    }))
  }, [class_?.studentsPerformance, isCompact])

  const topHeader = useMemo(() => {
    const handleLayout = (event: LayoutChangeEvent) => {
      setTopHeaderHeight(event.nativeEvent.layout.height)
    }

    return (
      <AnimatedView style={topHeaderAnimation}>
        <Appbar.Header style={topHeaderStyles} onLayout={handleLayout} statusBarHeight={0}>
          <Appbar.BackAction color={theme.colors.onPrimary} onPress={handleBack} />
          {isLoading && !isClassLoaded && (
            <Appbar.Content title={<ActivityIndicator animating={true} color={theme.colors.onPrimary} />} />
          )}

          {(!isLoading || isClassLoaded) && (
            <Appbar.Content color={theme.colors.onPrimary} title={title} subtitle={subtitle} />
          )}
          {(!isLoading || isClassLoaded) && (
            <Appbar.Action
              color={theme.colors.onPrimary}
              icon={isCompact ? 'view-compact' : 'view-compact-outline'}
              onPress={handleToggleCompact}
            />
          )}
        </Appbar.Header>
      </AnimatedView>
    )
  }, [
    topHeaderAnimation,
    topHeaderStyles,
    theme.colors.onPrimary,
    handleBack,
    isLoading,
    isClassLoaded,
    title,
    subtitle,
    isCompact,
    handleToggleCompact,
  ])

  const searchHeader = useMemo(
    () =>
      !isLoading || isClassLoaded ? (
        <Appbar.Header style={styles.appbar} statusBarHeight={0}>
          <Appbar.Action color={theme.colors.onPrimary} icon="magnify" />

          <TextInput
            blurOnSubmit={false}
            value={searchKeyword}
            //left={<TextInput.Icon icon="magnify" color={theme.colors.onPrimary} />}
            onChangeText={handleSearchKeywordChange}
            placeholder={'Caută după nume'}
            style={styles.searchbar}
            placeholderTextColor={theme.colors.onPrimary}
            selectionColor={theme.colors.onPrimary}
          />

          <Appbar.Action color={theme.colors.onPrimary} icon="close" onPress={handleClearSearchKeyword} />
        </Appbar.Header>
      ) : null,
    [
      handleClearSearchKeyword,
      handleSearchKeywordChange,
      isClassLoaded,
      isLoading,
      searchKeyword,
      styles.appbar,
      styles.searchbar,
      theme.colors.onPrimary,
    ]
  )

  const filteredCards = useMemo(
    () => studentsPerformance?.map(sp => cards?.find(card => card.id === sp.id)?.JSX || null),
    [cards, studentsPerformance]
  )

  return (
    <PageContainer
      key={id}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="always"
      onScroll={handleScrollEvent}
      stickyHeaderIndices={[0]}
    >
      <View style={styles.header}>
        <Appbar.Header style={[styles.appbar, { height: 0 }]}>{null}</Appbar.Header>
        {topHeader}
        {searchHeader}
      </View>

      <View style={styles.cards}>
        {!isLoading && filteredCards}

        {areDetailsLoaded && !studentsPerformance?.length && searchKeyword === '' && (
          <Text variant="bodyLarge">Aceasta clasa nu are elevi adaugati.</Text>
        )}
        {areDetailsLoaded && !studentsPerformance?.length && searchKeyword !== '' && (
          <Text variant="bodyLarge">Cautarea nu are niciun rezultat.</Text>
        )}
      </View>
    </PageContainer>
  )
})

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    cards: {
      paddingTop: 20,
      paddingHorizontal: 10,
    },
    appbar: {
      backgroundColor: theme.colors.primary,
    },
    appbarTop: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.inversePrimary,
    },
    header: {},
    searchbar: {
      color: theme.colors.onPrimary,
      backgroundColor: 'transparent',
      flexGrow: 1,
      flexShrink: 1,
      fontSize: 18,
    },
    refreshIndicator: {
      marginTop: 20,
    },
    searchingIcon: {
      marginRight: 10,
    },
  })
