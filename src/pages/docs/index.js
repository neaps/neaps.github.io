import React from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { Link } from 'gatsby'

const DocsPage = ({ data }) => (
  <Layout title="Documentation">
    <Container>
      <h3>
        <Link to="/docs/tide-prediction">
          Using the tide prediction package
        </Link>
      </h3>
      <p>
        How to use the{' '}
        <a href="https://www.npmjs.com/package/@neaps/tide-predictor">
          node tide prediction package.
        </a>
      </p>
      <h3>
        <Link to="/docs/harmonics/">An overview of harmonic constituents</Link>
      </h3>
      <p>
        Neaps uses predefined harmonic constituents to predict tides. Where
        there is a lot of math involved, a basic understanding is helpful.
      </p>
    </Container>
  </Layout>
)

export default DocsPage
