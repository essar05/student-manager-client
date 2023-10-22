import { makeStyles } from '../../shared/hooks/useStyles'

export const styles = makeStyles(theme => ({
  header: {
    marginBottom: 15,
  },
  appbar: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.inversePrimary,
  },
  appbarTitle: {
    color: theme.colors.inverseOnSurface,
    // font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    fontWeight: '400',
    lineHeight: 28,
    fontSize: 22,
  },
  appbarSubtitle: {
    color: theme.colors.inverseOnSurface,
  },
  cards: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
}))
