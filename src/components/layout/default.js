import React from 'react'
import styled from '@emotion/styled-base'
import Container from '../container'
import { Link } from 'gatsby'
import colors from '../../style/colors'
import { fontsBlack } from '../../style/font-families'
import { Flex, Box } from '@rebass/grid/emotion'
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav'
import '@reach/skip-nav/styles.css'

const Header = styled('header')`
  padding-top: 0.2rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  position: relative;
  background: ${colors.secondary.light};
  &::before{
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background-repeat: repeat-x;
    height: 10px;
    background-size: 20px 20px;
    background-image: radial-gradient(circle at 10px -5px, transparent 12px, white 13px);
  }
  &::after{
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background-repeat: repeat-x;
    height: 15px;
    background-size: 40px 20px;
    background-image: radial-gradient(circle at 10px 15px, white 12px, transparent 13px);
`

const HomeLink = styled(Link)`
  font-size: 1.3rem;
  color: ${colors.primary.dark} !important;
  text-decoration: none;
  font-family: ${fontsBlack.join(',')};
  &:hover {
    text-decoration: underline;
  }
`

const Navigation = styled('nav')`
  text-align: right;
  padding-top: 0.2rem;
  a {
    display: inline-block;
    margin-left: 1.5rem;
    color: ${colors.primary.dark};
    text-decoration: none;
  }
`

const Layout = ({ title, children }) => (
  <>
    <SkipNavLink />
    <Header>
      <Container>
        <Flex flexWrap="wrap">
          <Box width={[1 / 2]}>
            <HomeLink to="/">neaps</HomeLink>
          </Box>
          <Box width={[1 / 2]}>
            <Navigation>
              <Link to="/compare">Compare</Link>
              <a
                href="https://github.com/neaps"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </Navigation>
          </Box>
        </Flex>
      </Container>
    </Header>
    <SkipNavContent />
    {title && (
      <Container>
        <h1>{title}</h1>
      </Container>
    )}
    {children}
  </>
)

export default Layout
