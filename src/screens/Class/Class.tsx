import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { selectClass, selectIsLoading, useStore } from '@essar05/student-manager-core'
import { useSpring } from '@react-spring/native'
import {
  Dimensions,
  InteractionManager,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  TextInput,
  View,
} from 'react-native'
import { ActivityIndicator, Appbar, Text, useTheme } from 'react-native-paper'

import { PageContainer } from '../../components/PageContainer'
import { StudentCard } from '../../components/StudentPerformanceCard/StudentCard'
import { RootStackScreenProps } from '../../navigation/types'
import { useStyles } from '../../shared/hooks/useStyles'
import { getStorageItem, setStorageItem } from '../../shared/storage'
import { getBestMatchIndex, normalizeText } from '../../shared/utils'
import { AnimatedView, styles } from './Class.styles'

const HEADER_COLLAPSE_THRESHOLD = 40
const HEADER_EXPAND_THRESHOLD = 150

export const Class = memo(
  ({
    navigation,
    route: {
      params: { id },
    },
  }: RootStackScreenProps<'Class'>) => {
    const semester = 1

    const theme = useTheme()

    const fetchClass = useStore(state => state.classes.actions.fetchById)
    const class_ = useStore(state => selectClass(state, id))
    const isStoreLoading = useStore(selectIsLoading('class'))

    const areDetailsLoaded = useMemo(() => class_?.students, [class_?.students])

    const [isScreenInitialized, setScreenInitialized] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [isCompact, setCompact] = useState(false)
    const [isHeaderCollapsed, setHeaderCollapsed] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)

    const isLoading = useMemo(() => !isScreenInitialized || isStoreLoading, [isScreenInitialized, isStoreLoading])
    const isClassLoaded = useMemo(() => !!class_, [class_])

    const students = useMemo(() => {
      const keyword = normalizeText(searchKeyword)

      return keyword !== ''
        ? class_?.students
            ?.map(s => ({
              firstNameMatch: getBestMatchIndex(s.firstName, keyword),
              lastNameMatch: getBestMatchIndex(s.lastName, keyword),
              student: s,
            }))
            .filter(sf => sf.firstNameMatch > -1 || sf.lastNameMatch > -1)
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
            .map(sf => sf.student)
        : class_?.students
    }, [class_?.students, searchKeyword])

    const handleSearchKeywordChange = useCallback((value: string) => setSearchKeyword(value), [])

    const handleClearSearchKeyword = useCallback(() => handleSearchKeywordChange(''), [handleSearchKeywordChange])

    const handleToggleCompact = useCallback(
      () =>
        setCompact(isCompact => {
          setStorageItem('isStudentCardCompact', isCompact ? 'false' : 'true')

          return !isCompact
        }),
      []
    )

    const handleRefresh = useCallback(() => id && fetchClass(id, semester), [fetchClass, semester, id])

    const handleBack = useCallback(() => navigation.navigate('ClassList'), [navigation])

    const previousScrollOffset = useRef<number | null>(null)
    const previousIsScrollingUp = useRef<boolean | null>(null)

    const handleScrollEvent = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setContentHeight(event.nativeEvent.contentSize.height)

      const yVelocity = event.nativeEvent.velocity?.y || 1

      const offset = event.nativeEvent.contentOffset.y
      const isScrollingUp = !!previousScrollOffset.current && previousScrollOffset.current > offset

      const isHeaderCollapsed = !isScrollingUp
        ? offset > Math.max(HEADER_COLLAPSE_THRESHOLD * yVelocity * -1, HEADER_COLLAPSE_THRESHOLD)
        : offset > Math.max(HEADER_EXPAND_THRESHOLD * yVelocity * -1, HEADER_EXPAND_THRESHOLD)

      if ((isScrollingUp && !isHeaderCollapsed) || (!isScrollingUp && isHeaderCollapsed)) {
        setHeaderCollapsed(isHeaderCollapsed)
      }

      previousScrollOffset.current = offset
      previousIsScrollingUp.current = isScrollingUp
    }, [])

    const isHeaderCollapsingEnabled = useMemo(() => {
      return contentHeight - Dimensions.get('screen').height > 200
    }, [contentHeight])

    const title = useMemo(() => `Clasa ${class_?.schoolYear}${class_?.label}`, [class_?.label, class_?.schoolYear])
    const subtitle = useMemo(() => class_?.school.name, [class_?.school.name])

    const [topHeaderHeight, setTopHeaderHeight] = useState<number | null>(null)

    const topHeaderAnimation = useSpring({
      zIndex: -1,
      translateY: -(isHeaderCollapsed && isHeaderCollapsingEnabled ? topHeaderHeight || 0 : 0),
      config: { mass: 1, tension: 510, friction: 40 },
      immediate: topHeaderHeight === null || !isScreenInitialized,
    })

    useEffect(() => {
      if (id && semester && !areDetailsLoaded) {
        fetchClass(id, semester)
      }
    }, [fetchClass, id, semester, areDetailsLoaded])

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

      init().catch(console.error)
    }, [])

    const styled = useStyles(styles)

    const refreshControl = useMemo(
      () => <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />,
      [handleRefresh, isLoading]
    )

    const topHeaderStyles = useMemo(() => [styled.appbar, styled.appbarTop], [styled.appbar, styled.appbarTop])

    // OVERKILL !??
    const cards = useMemo(() => {
      return class_?.students?.map(s => ({
        id: s.id,
        JSX: <StudentCard key={s.id} student={s} classId={id} semester={semester} isCompact={isCompact} />,
      }))
    }, [class_?.students, id, semester, isCompact])

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
          <AnimatedView
            style={{
              translateY: topHeaderAnimation.translateY,
            }}
          >
            <Appbar.Header style={styled.appbar} statusBarHeight={0}>
              <Appbar.Action color={theme.colors.onPrimary} icon="magnify" />

              <TextInput
                blurOnSubmit={false}
                value={searchKeyword}
                //left={<TextInput.Icon icon="magnify" color={theme.colors.onPrimary} />}
                onChangeText={handleSearchKeywordChange}
                placeholder={'Caută după nume'}
                style={styled.searchbar}
                placeholderTextColor={theme.colors.onPrimary}
                selectionColor={theme.colors.onPrimary}
              />

              <Appbar.Action color={theme.colors.onPrimary} icon="close" onPress={handleClearSearchKeyword} />
            </Appbar.Header>
          </AnimatedView>
        ) : null,
      [
        handleClearSearchKeyword,
        handleSearchKeywordChange,
        isClassLoaded,
        isLoading,
        topHeaderAnimation,
        searchKeyword,
        styled.appbar,
        styled.searchbar,
        theme.colors.onPrimary,
      ]
    )

    const filteredCards = useMemo(
      () => students?.map(sp => cards?.find(card => card.id === sp.id)?.JSX || null),
      [cards, students]
    )

    return (
      <PageContainer
        key={id}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="always"
        onScroll={handleScrollEvent}
        stickyHeaderIndices={[0]}
      >
        <View style={styled.header}>
          <Appbar.Header style={[styled.appbar, { height: 0 }]}>{null}</Appbar.Header>
          {topHeader}
          {searchHeader}
        </View>

        <View style={styled.cards}>
          {!isLoading && filteredCards}

          {areDetailsLoaded && !students?.length && searchKeyword === '' && (
            <Text variant="bodyLarge">Aceasta clasa nu are elevi adaugati.</Text>
          )}
          {areDetailsLoaded && !students?.length && searchKeyword !== '' && (
            <Text variant="bodyLarge">Cautarea nu are niciun rezultat.</Text>
          )}
        </View>
      </PageContainer>
    )
  }
)
