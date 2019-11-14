import React from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { graphql } from 'gatsby'

const DocsPage = ({ data }) => (
  <Layout title="Documentation">
    <Container
      dangerouslySetInnerHTML={{
        __html: data.allFile.nodes[0].childMarkdownRemark.html
          .split('<!-- START DOCS -->')
          .pop()
      }}
    />
  </Layout>
)

export default DocsPage

export const query = graphql`
  {
    allFile(filter: { name: { eq: "README" } }) {
      nodes {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
