import React from 'react'
import Container from '../../components/container'
import Table from '../../components/table'
import colors from '../../style/colors'
import tidePrediction from '@neaps/tide-predictor'
import moment from 'moment-timezone'
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory'
import { ButtonLink, Button, ButtonAnchor } from '../../components/button'

const Preview = ({ harmonics, levels, dataTimezone, id }) => {
  dataTimezone = dataTimezone ? dataTimezone : 'Etc/UTC'
  const chartHarmonics = []
  const chartData = []
  Object.keys(harmonics).forEach(harmonic => {
    chartHarmonics.push({
      phase: harmonics[harmonic].phase,
      amplitude: harmonics[harmonic].amplitude,
      name: harmonic
    })
  })
  const harmonicsJson = JSON.stringify(chartHarmonics, null, 2)
  const previewPrediction = tidePrediction(chartHarmonics, {
    phaseKey: 'phase'
  })
  levels.results.slice(0, 100).forEach(level => {
    const now = moment(level.t)
      .tz(dataTimezone)
      .utc()
      .toDate()
    const neapsPrediction = previewPrediction.getWaterLevelAtTime({
      time: now
    })
    chartData.push({
      time: level.t,
      value: parseFloat(level.v),
      prediction: neapsPrediction.level
    })
  })

  return (
    <Container>
      <h2>Data preview</h2>
      <ButtonLink to={`/harmonics/submit?id=${id}`}>Submit data</ButtonLink>
      <ButtonAnchor
        download="harmonics.json"
        href={URL.createObjectURL(new Blob([harmonicsJson]))}
      >
        Download data
      </ButtonAnchor>
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
          data={chartData}
          interpolation="cardinal"
          style={{
            data: {
              strokeWidth: '1px',
              stroke: colors.secondary.highlight
            }
          }}
          x="time"
          y="value"
        />
        <VictoryLine
          data={chartData}
          interpolation="cardinal"
          style={{
            data: {
              strokeWidth: '1px',
              stroke: 'tomato'
            }
          }}
          x="time"
          y="prediction"
        />
      </VictoryChart>
      <h2>Tidal constituents</h2>
      <Table>
        <thead>
          <tr>
            <th>Constituent</th>
            <th>Amplitude</th>
            <th>Phase</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(harmonics).map(constituent => (
            <tr key={constituent}>
              <td>{constituent}</td>
              <td>{harmonics[constituent].amplitude}</td>
              <td>{harmonics[constituent].phase}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Preview
