const request = require('sync-request')
const crypto = require('crypto')

exports.sourceNodes = ({ actions, createNodeId, reporter }, configOptions) => {
  const { createNode } = actions
  const { stations } = configOptions
  const fetchActivity = reporter.activityTimer('Downloading NOAA tide data')
  fetchActivity.start()
  stations.forEach(stationId => {
    const station = {
      id: createNodeId(`${stationId} >>> NoaaStation`),
      parent: null,
      children: [],
      internal: {
        type: `NoaaStation`
      }
    }
    const harmonics = request(
      'GET',
      `https://tidesandcurrents.noaa.gov/mdapi/v1.0/webapi/stations/${stationId}/harcon.json?units=metric`
    )
    station.harmonics = JSON.parse(harmonics.getBody())
    const levels = request(
      'GET',
      `https://tidesandcurrents.noaa.gov/api/datagetter?date=recent&station=${stationId}&product=predictions&datum=MTL&time_zone=gmt&units=metric&format=json`
    )
    station.levels = JSON.parse(levels.getBody())
    const datum = request(
      'GET',
      `https://tidesandcurrents.noaa.gov/mdapi/v1.0/webapi/stations/${stationId}/datums.json?units=metric`
    )
    station.datum = JSON.parse(datum.getBody())
    const info = request(
      'GET',
      `https://tidesandcurrents.noaa.gov/mdapi/latest/webapi/stations/${stationId}.json?units=english`
    )
    station.info = JSON.parse(info.getBody())
    const observations = request(
      'GET',
      `https://tidesandcurrents.noaa.gov/api/datagetter?date=recent&station=${stationId}&product=water_level&datum=MTL&time_zone=gmt&units=metric&format=json`
    )
    station.observations = JSON.parse(observations.getBody())

    station.internal.contentDigest = crypto
      .createHash(`md5`)
      .update(`noaa-station-${stationId}`)
      .digest(`hex`)
    createNode(station)
  })
  fetchActivity.end()
}
