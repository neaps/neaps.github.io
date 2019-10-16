import React from 'react'
import Layout from '../components/layout/default'
import Container from '../components/container'
import { LeadParagraph, SectionTitle } from '../components/type'
import Code from '../components/code'
import { graphql } from 'gatsby'
import TideChart from '../components/tide-chart'

const installCode = `# yarn
yarn install @neaps/tide-prediction

#npm
npm install --save @neaps/tide-prediction`

const basicUsageCode = `import TidePrediction from "@neaps/tide-prediction";
const constituents = [
  {
    phase_GMT: 98.7,
    phase_local: 313.7,
    amplitude: 2.687,
    name: "M2",
    speed: 28.984104
  }
  //....there are usually many, read the docs
];

const highLowTides = tidePrediction(constituents, {
  phaseKey: "phase_GMT"
}).getExtremesPrediction(
  new Date("2019-01-01"),
  new Date("2019-01-10")
);`

const IndexPage = ({ data }) => (
  <Layout>
    <Container>
      <LeadParagraph>
        <strong>neap tide:</strong> The time where there is the least differece
        between high and low water.
      </LeadParagraph>
      <LeadParagraph>
        <strong>neaps:</strong> JavaScript tide predictor for the browser or
        server.
      </LeadParagraph>
      <p>
        Many agencies{' '}
        <a href="https://tidesandcurrents.noaa.gov/web_services_info.html">
          like{' '}
          <abbr title="National Oceanic and Atmospheric Administration">
            NOAA
          </abbr>
        </a>{' '}
        provide high-quality tide data and prediction services. But these
        services require online access, and are not available for every country.
      </p>
      <p>
        <strong>Neaps</strong> uses standard algorithims to predict tide levels
        anywhere that has well-defined harmonic constituents, or a record of
        past water levels. This is useful for:
      </p>
      <ul>
        <li>Offline access</li>
        <li>Faster processing for multiple locations</li>
        <li>Predicting in areas with no well-built APIs</li>
      </ul>
      <SectionTitle>How it compares</SectionTitle>
      <p>
        Here's a chart comparing Neaps, NOAA prediction, and actual observed
        water levels for{' '}
        <a
          href="https://tidesandcurrents.noaa.gov/map/index.html?id=9413450"
          target="_blank"
          rel="noopener noreferrer"
        >
          Monterey, California
        </a>
        .
      </p>
      <TideChart station={data.allNoaaStation.nodes[0]} />

      <SectionTitle>Installation</SectionTitle>
      <p>Install with your favorite package manager.</p>
      <Code code={installCode} language="shell" />
      <SectionTitle>Basic Usage</SectionTitle>
      <Code code={basicUsageCode} language="javascript" />
    </Container>
  </Layout>
)

export default IndexPage

export const query = graphql`
  {
    allNoaaStation(
      filter: { info: { stations: { elemMatch: { id: { eq: "9413450" } } } } }
    ) {
      nodes {
        id
        info {
          stations {
            name
            state
          }
        }
        harmonics {
          HarmonicConstituents {
            phase_GMT
            phase_local
            amplitude
            name
            speed
          }
        }
        datum {
          datums {
            name
            value
          }
        }
        observations {
          data {
            t
            v
          }
        }
        levels {
          predictions {
            v
            t
          }
        }
      }
    }
  }
`
