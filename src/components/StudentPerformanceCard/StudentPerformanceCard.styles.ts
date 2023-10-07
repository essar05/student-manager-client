import { makeStyles } from '../../shared/hooks/useStyles'

export const styles = makeStyles(() => ({
  card: {
    marginBottom: 15,
    padding: 0,
  },
  hidden: {
    display: 'none',
    marginBottom: 0,
  },
  cardTitle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    paddingLeft: 15,
    minHeight: 70,
  },
  cardTitleTitle: {
    padding: 0,
    margin: 0,
  },
  cardContentVertical: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
  },
  cardContentLabel: {
    flexShrink: 1,
    overflow: 'hidden',
    marginLeft: 4,
    marginBottom: 5,
  },
  cardContent: {
    padding: 10,
  },
  titleRight: {},
  avgMark: {
    backgroundColor: '#1d83c4',
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },
  menuDivider: {
    // backgroundColor: theme.colors.surface,
  },
}))
