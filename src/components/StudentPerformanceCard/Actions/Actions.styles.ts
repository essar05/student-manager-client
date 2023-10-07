import { makeStyles } from '../../../shared/hooks/useStyles'

export const styles = makeStyles(() => ({
  actions: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
  actionsBottom: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  action: {
    flex: 1,
    minWidth: undefined,
    padding: 0,
    marginBottom: 5,
    marginRight: 5,
  },
  actionRight: {
    marginLeft: 10,
    marginBottom: 5,
    marginRight: 0,
  },
  actionContent: {
    padding: 0,
  },
  actionLabel: {
    marginLeft: 0,
    marginRight: 0,
  },
}))
