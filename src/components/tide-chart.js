import React, { useState, useEffect } from 'react'
import tidePrediction from '@neaps/tide-predictor'
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory'
import styled from '@emotion/styled'
import colors from '../style/colors'

const TideChartItem = styled.div`
  width: 66ch;
  height: 500px;
`

const TideChart = ({ station }) => {
  const [chartData, setChartData] = useState(false)
  const observations = []
  station.observations.data.forEach(observation => {
    observations.push({
      time: new Date(observation.t).getTime(),
      value: parseFloat(observation.v)
    })
  })
  useEffect(() => {
    let mtl = 0
    let mllw = 0
    station.datum.datums.forEach(datum => {
      if (datum.name === 'MTL') {
        mtl = datum.value
      }
      if (datum.name === 'MLLW') {
        mllw = datum.value
      }
    })
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
        <TideChartItem>
          <VictoryChart>
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
                data: { strokeWidth: '1px', stroke: colors.secondary.highlight }
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
      )}
    </>
  )
}

export default TideChart
