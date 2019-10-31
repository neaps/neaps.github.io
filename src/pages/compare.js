import React from 'react'
import Layout from '../components/layout/default'
import Container from '../components/container'
import TideChart, { TideChartLegend } from '../components/tide-chart'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'

const TideStation = styled.div`
  margin-bottom: 50px;
`

const ComparePage = ({ data }) => (
  <Layout title="Compare">
    <Container>
      <p>
        Below are the past three days of tidal predictions made by Neaps, NOAA,
        plus the actual tidal levels measured by real-world guages.
      </p>
      <TideChartLegend />
      {data.allNoaaStation.nodes.map(station => (
        <TideStation key={station.id}>
          <h2>
            {station.info.stations[0].name}
            {station.info.stations[0].state && (
              <>
                {', '}
                {station.info.stations[0].state}
              </>
            )}
          </h2>
          <TideChart station={station} />
        </TideStation>
      ))}
    </Container>
  </Layout>
)

export default ComparePage

export const query = graphql`
  {
    allNoaaStation {
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
