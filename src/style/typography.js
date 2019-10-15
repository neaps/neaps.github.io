import Typography from 'typography'
import './fonts'
import colors from './colors'
import { fontsBlack, fontsBody } from './font-families'

const typography = new Typography({
  baseFontSize: '20px',
  baseLineHeight: 1.45,
  headerFontFamily: fontsBlack,
  bodyFontFamily: fontsBody,
  overrideStyles: ({ adjustFontSizeTo, rhythm }, options, styles) => ({
    a: {
      color: colors.link,
    },
    'a:visited': {
      color: colors.link,
    },
  }),
})

export default typography
