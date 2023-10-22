import { animated } from '@react-spring/native'
import { View } from 'react-native'

import { makeStyles } from '../../shared/hooks/useStyles'

export const AnimatedView = animated(View)

export const styles = makeStyles(theme => ({
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
  header: {
    zIndex: 0,
    marginBottom: 15,
  },
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
}))
