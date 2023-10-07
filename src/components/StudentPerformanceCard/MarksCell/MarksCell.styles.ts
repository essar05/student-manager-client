import { makeStyles } from '../../../shared/hooks/useStyles'

export const styles = makeStyles(() => ({
  marks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mark: {
    margin: 2,
    minWidth: 31,
  },
  markText: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))
