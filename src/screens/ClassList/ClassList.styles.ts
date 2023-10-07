import { makeStyles } from '../../shared/hooks/useStyles'

export const styles = makeStyles(theme => ({
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
}))
