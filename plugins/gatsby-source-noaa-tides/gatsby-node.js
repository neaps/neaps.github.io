const request = require('sync-request')
const crypto = require('crypto')
const fs = require('fs')

if (!fs.existsSync('./.noaa-cache')) {
  fs.mkdirSync('./.noaa-cache')
}

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

    const filePath = `./.noaa-cache/${stationId}.json`
    if (fs.existsSync(filePath)) {
      const cachedStation = JSON.parse(fs.readFileSync(filePath))
      station.harmonics = cachedStation.harmonics
      station.levels = cachedStation.levels
      station.datum = cachedStation.datum
      station.info = cachedStation.info
      station.observations = cachedStation.observations
    } else {
      const harmonics = request(
        'GET',
        `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}/harcon.json?units=metric`
      )
      station.harmonics = JSON.parse(harmonics.getBody())
      const levels = request(
        'GET',
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=recent&station=${stationId}&product=predictions&datum=MTL&time_zone=gmt&units=metric&format=json`
      )
      station.levels = JSON.parse(levels.getBody())
      const datum = request(
        'GET',
        `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}/datums.json?units=metric`
      )
      station.datum = JSON.parse(datum.getBody())
      const info = request(
        'GET',
        `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${stationId}.json?units=english`
      )
      station.info = JSON.parse(info.getBody())
      const observations = request(
        'GET',
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=recent&station=${stationId}&product=water_level&datum=MTL&time_zone=gmt&units=metric&format=json`
      )
      station.observations = JSON.parse(observations.getBody())
    }
    fs.writeFileSync(filePath, JSON.stringify(station))
    station.internal.contentDigest = crypto
      .createHash(`md5`)
      .update(`noaa-station-${stationId}`)
      .digest(`hex`)
    createNode(station)
  })
  fetchActivity.end()
}
