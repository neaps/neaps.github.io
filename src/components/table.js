import styled from '@emotion/styled'
import colors from '../style/colors'

const Table = styled.table`
  td,
  th {
    ${props =>
      props.light
        ? `border-bottom: 1px solid #fff;`
        : `border-bottom: 1px solid ${colors.primary.dark};`}
  }
`

export default Table
