import { makeStyles } from '../../shared/hooks/useStyles'

export const styles = makeStyles(theme => ({
  container: {
    minHeight: '100%',
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 30,
  },
  message: {
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  input: {
    width: '100%',
    marginVertical: 5,
  },
  button: {
    width: '100%',
    marginVertical: 20,
  },
  buttonText: {
    color: theme.colors.inverseSurface,
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
}))
