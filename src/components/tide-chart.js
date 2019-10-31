import React, { useState, useEffect } from 'react'
import tidePrediction from '@neaps/tide-predictor'
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory'
import styled from '@emotion/styled'
import colors from '../style/colors'
import { fontsBlack } from '../style/font-families'

const TideChartToggle = styled.button`
  background: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-size: 0.8rem;
  width: 100%;
  display: block;
  border-bottom: 1px solid black;
`

const TideChartLabel = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  font-family: ${fontsBlack.join(', ')};
  ${props => props.color && `color: ${props.color};`}
  ${props => props.background && `background: ${props.background};`}
`

const TideTable = styled.table`
  tr {
    border-bottom: 1px solid ${colors.primary.dark};
  }
`

const TideChartItem = styled.div`
  width: 66ch;
  height: 400px;
`

const TideChart = ({ station }) => {
  const [chartData, setChartData] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const observations = []
  station.observations.data.forEach(observation => {
    observations.push({
      time: new Date(observation.t).getTime(),
      value: parseFloat(observation.v)
    })
  })
  useEffect(() => {
    const tideStationPrediction = tidePrediction(
      station.harmonics.HarmonicConstituents,
      {
        phaseKey: 'phase_GMT'
      }
    )
    const results = []
    station.levels.predictions.forEach(prediction => {
      const now = new Date(prediction.t)
      const neapsPrediction = tideStationPrediction.getWaterLevelAtTime({
        time: now
      })
      results.push({
        time: now.getTime(),
        noaa: parseFloat(prediction.v),
        neapsPrediction: neapsPrediction.level
      })
    })
    setChartData(results)
  }, [station.harmonics, station.datum.datums, station.levels.predictions])
  return (
    <>
      {chartData && (
        <>
          <TideChartItem>
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
                data={observations}
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
                  data: { strokeWidth: '1px', stroke: colors.secondary.dark }
                }}
                x="time"
                y="noaa"
              />
              <VictoryLine
                data={chartData}
                interpolation="cardinal"
                style={{ data: { strokeWidth: '1px', stroke: 'tomato' } }}
                x="time"
                y="neapsPrediction"
              />
            </VictoryChart>
          </TideChartItem>

          <TideChartToggle
            onClick={event => {
              event.preventDefault()
              setIsExpanded(!isExpanded)
            }}
            aria-expanded={isExpanded}
            aria-controls={`tide-station-table-${station.id}`}
          >
            View chart data
          </TideChartToggle>
          {isExpanded && (
            <>
              <p>All water levels are in meters and time is UTC.</p>
              <TideTable id={`tide-station-table-${station.id}`}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>NOAA prediction</th>
                    <th>Neaps prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((observation, index) => (
                    <tr key={`tide-station-table-${station.id}-${index}`}>
                      <td>{new Date(observation.time).toGMTString()}</td>
                      <td>{observation.noaa}</td>
                      <td>
                        {Math.round(observation.neapsPrediction * 1000) / 1000}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TideTable>
            </>
          )}
        </>
      )}
    </>
  )
}

const TideChartLegend = () => (
  <p>
    <TideChartLabel background="tomato" color="#FFF">
      Red is Neaps
    </TideChartLabel>
    {', '}
    <TideChartLabel background={colors.primary.dark} color="#FFF">
      dark blue is NOAA
    </TideChartLabel>
    {', '}and{' '}
    <TideChartLabel background={colors.secondary.highlight}>
      light blue is observed water levels
    </TideChartLabel>
    .
  </p>
)

export default TideChart
export { TideChartLabel, TideChartLegend }
