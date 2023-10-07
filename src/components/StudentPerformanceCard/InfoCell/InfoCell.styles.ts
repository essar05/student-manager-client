import { makeStyles } from '../../../shared/hooks/useStyles'

export const styles = makeStyles(() => ({
  cardContentCell: {
    paddingRight: 0,
    paddingLeft: 5,
    flexShrink: 1,
    flexGrow: 1,
  },
  value: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}))
