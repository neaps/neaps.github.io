import React from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { Link } from 'gatsby'

const DocsPage = ({ data }) => (
  <Layout title="Tide database">
    <Container>
      <p>
        The availability of good harmonic constituent data varies from country
        to country, resulting in very different tide predeictions depending on
        what products you use. Within the United States, NOAA provides excellent
        harmonic constituents for free, but internationally it is a different
        story.
      </p>

      <p>
        We first observed these challenges in Gulfo Nuevo in Argentina. The gulf
        is very deep, with a narrow mouth to the Atlantic and sloping benthic
        profile. As a result, the difference between high and low tides is
        consistently 5 meters or more. Various websites and products we used had
        different levels of accuracy when predicting the tides. We found one
        that was just predicting tides from a station over 200km away, outside
        the gulf, and therefore completely different in terms of water level and
        timing.
      </p>

      <p>
        The various surf or weather report apps either use old data, or base
        large areas of coastline on one station. Many people are still using
        pre-2004 data published in Xtide's Harmbase. Harmbase is great, but it's
        data is locked in binary files and SQL, and the maintainer{' '}
        <a href="https://flaterco.com/xtide/faq.html#60">
          has given up on maintaining it outside the US
        </a>
        .
      </p>
    </Container>
  </Layout>
)

export default DocsPage
