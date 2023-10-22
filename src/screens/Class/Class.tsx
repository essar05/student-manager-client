import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  selectClass,
  selectIsLoading,
  StudentWithPerformance,
  useSemester,
  useStore,
} from '@essar05/student-manager-core'
import {
  FlatList,
  InteractionManager,
  ListRenderItem,
  RefreshControl,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native'
import { ActivityIndicator, Appbar, Text, useTheme } from 'react-native-paper'

import { StudentCard } from '../../components/StudentPerformanceCard/StudentCard'
import { RootStackScreenProps } from '../../navigation/types'
import { useStyles } from '../../shared/hooks/useStyles'
import { getStorageItem, setStorageItem } from '../../shared/storage'
import { getBestMatchIndex, normalizeText } from '../../shared/utils'
import { AnimatedView, styles } from './Class.styles'
import { ContextMenu } from './ContextMenu/ContextMenu'

export const Class = memo(
  ({
    navigation,
    route: {
      params: { id },
    },
  }: RootStackScreenProps<'Class'>) => {
    const theme = useTheme()

    const fetchClass = useStore(state => state.classes.actions.fetchById)
    const class_ = useStore(state => selectClass(state, id))
    const isStoreLoading = useStore(selectIsLoading('class'))

    const { maxSemester } = useSemester(undefined, class_)

    const [inputSemester, setInputSemester] = useState<1 | 2>(2)

    const semester = maxSemester && inputSemester > maxSemester ? maxSemester : inputSemester

    const areDetailsLoaded = useMemo(() => class_?.students, [class_?.students])

    const [isScreenInitialized, setScreenInitialized] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [isCompact, setCompact] = useState(false)

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

    const title = useMemo(() => `Clasa ${class_?.schoolYear}${class_?.label}`, [class_?.label, class_?.schoolYear])
    const subtitle = useMemo(() => class_?.school.name, [class_?.school.name])

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

    const [isMenuVisible, setMenuVisible] = useState(false)

    const closeMenu = useCallback(() => setMenuVisible(false), [])
    const openMenu = useCallback(() => setMenuVisible(true), [])

    const handleSelectSemester1 = useCallback(() => {
      setInputSemester(1)
    }, [])

    const handleSelectSemester2 = useCallback(() => {
      setInputSemester(2)
    }, [])

    const refreshControl = useMemo(
      () => <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />,
      [handleRefresh, isLoading]
    )

    const topHeaderStyles = useMemo(() => [styled.appbar, styled.appbarTop], [styled.appbar, styled.appbarTop])

    const searchHeader = useMemo(
      () =>
        !isLoading || isClassLoaded ? (
          <AnimatedView>
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
        searchKeyword,
        styled.appbar,
        styled.searchbar,
        theme.colors.onPrimary,
      ]
    )

    const renderCard = useCallback<ListRenderItem<StudentWithPerformance>>(
      ({ item }) => <StudentCard student={item} classId={id} semester={semester} isCompact={isCompact} />,
      [id, isCompact, semester]
    )

    return (
      <SafeAreaView style={{ height: '100%' }}>
        <FlatList
          style={{
            height: '100%',
          }}
          stickyHeaderHiddenOnScroll
          stickyHeaderIndices={[0]}
          // estimatedItemSize={isCompact ? 100 : 240}
          // initialNumToRender={isCompact ? 10 : 6}
          // maxToRenderPerBatch={isCompact ? 10 : 6}
          // windowSize={10}
          ListHeaderComponent={
            <View style={styled.header}>
              <Appbar.Header style={[styled.appbar, { height: 0 }]}>{null}</Appbar.Header>
              <Appbar.Header style={topHeaderStyles} statusBarHeight={0}>
                <Appbar.BackAction color={theme.colors.onPrimary} onPress={handleBack} />
                {isLoading && !isClassLoaded && (
                  <Appbar.Content title={<ActivityIndicator animating={true} color={theme.colors.onPrimary} />} />
                )}

                {(!isLoading || isClassLoaded) && (
                  <Appbar.Content color={theme.colors.onPrimary} title={title} subtitle={subtitle} />
                )}
                {(!isLoading || isClassLoaded) &&
                  (maxSemester === 2 ? (
                    <ContextMenu
                      visible={isMenuVisible}
                      onDismiss={closeMenu}
                      onOpen={openMenu}
                      semester={semester}
                      onSemester1Select={handleSelectSemester1}
                      onSemester2Select={handleSelectSemester2}
                      isCompact={isCompact}
                      onToggleCompact={handleToggleCompact}
                    />
                  ) : (
                    <Appbar.Action
                      color={theme.colors.onPrimary}
                      icon={isCompact ? 'view-compact' : 'view-compact-outline'}
                      onPress={handleToggleCompact}
                    />
                  ))}
              </Appbar.Header>
              {searchHeader}
            </View>
          }
          ListEmptyComponent={
            <>
              {areDetailsLoaded && !students?.length && searchKeyword === '' && (
                <Text variant="bodyLarge">Aceasta clasa nu are elevi adaugati.</Text>
              )}
              {areDetailsLoaded && !students?.length && searchKeyword !== '' && (
                <Text variant="bodyLarge">Cautarea nu are niciun rezultat.</Text>
              )}
            </>
          }
          refreshControl={refreshControl}
          refreshing={isLoading}
          keyboardShouldPersistTaps="always"
          // stickyHeaderIndices={[0]}
          // sticky
          data={students}
          renderItem={renderCard}
          extraData={{
            isCompact,
            semester,
            classId: id,
          }}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>
    )
  }
)
