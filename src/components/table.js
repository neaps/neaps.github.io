import styled from '@emotion/styled'
import colors from '../style/colors'
import { fontsBlack } from '../style/font-families'
const Table = styled.table`
  td,
  th {
    ${props =>
      props.light
        ? `border-bottom: 1px solid #fff;`
        : `border-bottom: 1px solid ${colors.primary.dark};`}
  }
  th {
    font-family: ${fontsBlack.join(',')};
  }
`

export default Table
