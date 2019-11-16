import React from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import constituents from '@neaps/tide-predictor/src/constituents'
import { LeadParagraph } from '../../components/type'
import Table from '../../components/table'
import colors from '../../style/colors'
import { Flex, Box } from '@rebass/grid/emotion'
import tidePrediction from '@neaps/tide-predictor'
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory'
import { Link, graphql } from 'gatsby'
import randomcolor from 'randomcolor'

const DocsHarmonicsPage = ({ data }) => {
  const allConstituents = {}
  data.allNoaaStation.nodes[0].harmonics.HarmonicConstituents.forEach(
    constituent => {
      allConstituents[constituent.name] = constituent.description
    }
  )
  return (
    <Layout title="How harmonic constituents work">
      <Container>
        <LeadParagraph>
          Tide predictions are created by adding up the effects of potentially
          hundreds of factors like the location of the sun, the moon, and the
          benthic environment. These constituents are derived from analyzing
          past water levels.
        </LeadParagraph>

        <p>
          You can think of each tidal constituent as a sine wave. For example,
          below is a single constituent, M2, or "Principal lunar semidiurnal
          constituent" for Monterey, California during the first week of 2018:
        </p>

        <SingleConstituent />

        <p>
          If this constituent, which measures the regular effect of the moon on
          water levels, were the only one that affected the tides, then tides
          would go up and down in a regular pattern.
        </p>

        <p>
          However, once you add more constituents to measure more effects, it
          gets complicated.To simplify, let us take just four constituents and
          plot them for the same location:
        </p>

        <MultipleConstituent />

        <p>
          Just for fun, let's take a look at <strong>all</strong> the defined
          constituents:
        </p>

        <AllConstituents
          harmonics={
            data.allNoaaStation.nodes[0].harmonics.HarmonicConstituents
          }
        />

        <p>
          If we add all these constituents together, they cancel each other or
          amplify each other, leading to an accurate tide prediction:
        </p>

        <Predictions
          harmonics={
            data.allNoaaStation.nodes[0].harmonics.HarmonicConstituents
          }
        />

        <p>
          To read more about tidal constituents, the following resources are
          helpful:
        </p>

        <ul>
          <li>
            <a href="https://github.com/sam-cox/pytides/wiki/Theory-of-the-Harmonic-Model-of-Tides">
              Theory of the harmonic model of tides
            </a>{' '}
            - An exhaustive description of how Pytide and Neaps handle tidal
            constituents.
          </li>
          <li>
            <a href="https://tidesandcurrents.noaa.gov/harmonic.html">
              NOAA overview of harmonics
            </a>
          </li>
          <li>
            <a href="https://flaterco.com/xtide/harmonics.html">
              About harmonic constants and sub station corrections
            </a>{' '}
            - The classic Xtide description of harmonic constituents.
          </li>
        </ul>

        <h2>Where tidal constituents come from</h2>

        <p>
          Tidal constituents are derived by running linear regressions (read:
          lots of maths) on observed water levels. Some agencies, like NOAA,
          publish tidal constituents that are avialble on their website and via
          an API. Other agencies do not provide constituents, but do provide
          data on observed levels.
        </p>

        <p>
          We are also working on a{' '}
          <a href="https://github.com/neaps/tide-database">
            world-wide database of tidal constiutents
          </a>
          .
        </p>

        <p>
          If you have at least a year of observations (one an hour will usually
          do), you can{' '}
          <Link to="/harmonics">generate your own constituents</Link> on this
          website. These can even be added to a growing database of global tide
          stations.
        </p>

        <h3>Constituents supported by Neaps</h3>
        <p>
          Neaps supports all the major tidal constituents, and we are still
          adding the more esoteric ones that affect large shallow bays.
        </p>
        <Table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>In Neaps</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(allConstituents).map(name => (
              <tr key={name}>
                <td>{name}</td>
                <td>{allConstituents[name]}</td>
                <td>
                  {constituents[name] ? <>Supported</> : <>Not supported</>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Layout>
  )
}

const SingleConstituent = () => {
  const predictedHeights = tidePrediction(
    [
      {
        name: 'M2',
        amplitude: 0.491,
        phase_GMT: 181.3
      }
    ],
    {
      phaseKey: 'phase_GMT'
    }
  ).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })
  return (
    <VictoryChart
      padding={{ top: 0, bottom: 0, left: 50, right: 50 }}
      height={200}
    >
      <VictoryAxis
        crossAxis
        style={{
          tickLabels: { fill: 'none' }
        }}
      />
      <VictoryAxis dependentAxis style={{}} label="Meters" />
      <VictoryLine
        data={predictedHeights}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: colors.secondary.highlight
          }
        }}
        x="time"
        y="level"
      />
    </VictoryChart>
  )
}

const MultipleConstituent = () => {
  const predictedHeightsM2 = tidePrediction(
    [
      {
        name: 'M2',
        amplitude: 0.491,
        phase_GMT: 181.3
      }
    ],
    {
      phaseKey: 'phase_GMT'
    }
  ).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })

  const predictedHeightsS2 = tidePrediction(
    [
      {
        name: 'S2',
        amplitude: 0.177,
        phase_GMT: 150.8
      }
    ],
    {
      phaseKey: 'phase_GMT'
    }
  ).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })

  const predictedHeightsN2 = tidePrediction(
    [
      {
        name: 'N2',
        amplitude: 0.117,
        phase_GMT: 133.2
      }
    ],
    {
      phaseKey: 'phase_GMT'
    }
  ).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })

  const predictedHeightsK1 = tidePrediction(
    [
      {
        name: 'K1',
        amplitude: 0.354,
        phase_GMT: 212.4
      }
    ],
    {
      phaseKey: 'phase_GMT'
    }
  ).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })
  return (
    <VictoryChart
      padding={{ top: 0, bottom: 0, left: 50, right: 50 }}
      height={200}
    >
      <VictoryAxis
        crossAxis
        style={{
          tickLabels: { fill: 'none' }
        }}
      />
      <VictoryAxis dependentAxis style={{}} label="Meters" />
      <VictoryLine
        data={predictedHeightsM2}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: colors.secondary.highlight
          }
        }}
        x="time"
        y="level"
      />

      <VictoryLine
        data={predictedHeightsS2}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: 'tomato'
          }
        }}
        x="time"
        y="level"
      />

      <VictoryLine
        data={predictedHeightsN2}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: 'green'
          }
        }}
        x="time"
        y="level"
      />

      <VictoryLine
        data={predictedHeightsK1}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: 'blue'
          }
        }}
        x="time"
        y="level"
      />
    </VictoryChart>
  )
}

const AllConstituents = ({ harmonics }) => {
  const heights = []
  harmonics.forEach(harmonic => {
    heights.push(
      tidePrediction([harmonic], {
        phaseKey: 'phase_GMT'
      }).getTimelinePrediction({
        start: new Date('2018-01-01'),
        end: new Date('2018-01-05')
      })
    )
  })
  return (
    <VictoryChart
      padding={{ top: 0, bottom: 0, left: 50, right: 50 }}
      height={200}
    >
      <VictoryAxis
        crossAxis
        style={{
          tickLabels: { fill: 'none' }
        }}
      />
      <VictoryAxis dependentAxis style={{}} label="Meters" />
      {heights.map(height => (
        <VictoryLine
          data={height}
          interpolation="cardinal"
          style={{
            data: {
              strokeWidth: '1px',
              stroke: randomcolor()
            }
          }}
          x="time"
          y="level"
        />
      ))}
    </VictoryChart>
  )
}

const Predictions = ({ harmonics }) => {
  const predictedHeights = tidePrediction(harmonics, {
    phaseKey: 'phase_GMT'
  }).getTimelinePrediction({
    start: new Date('2018-01-01'),
    end: new Date('2018-01-05')
  })
  return (
    <VictoryChart
      padding={{ top: 0, bottom: 0, left: 50, right: 50 }}
      height={200}
    >
      <VictoryAxis
        crossAxis
        style={{
          tickLabels: { fill: 'none' }
        }}
      />
      <VictoryAxis dependentAxis style={{}} label="Meters" />

      <VictoryLine
        data={predictedHeights}
        interpolation="cardinal"
        style={{
          data: {
            strokeWidth: '1px',
            stroke: 'blue'
          }
        }}
        x="time"
        y="level"
      />
    </VictoryChart>
  )
}

export default DocsHarmonicsPage

export const query = graphql`
  {
    allNoaaStation(
      filter: { info: { stations: { elemMatch: { id: { eq: "9413450" } } } } }
    ) {
      nodes {
        harmonics {
          HarmonicConstituents {
            amplitude
            name
            description
            phase_GMT
          }
        }
      }
    }
  }
`
