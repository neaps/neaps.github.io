import bp from '../style/breakpoints'
import styled from '@emotion/styled'

const Container = styled.div`
  ${bp({
    maxWidth: ['100%', '100%', '66ch'],
    margin: ['0 1rem', '0 1rem', '0 auto']
  })}
`

export default Container
