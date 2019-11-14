import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { graphql } from 'gatsby'
import uuid from 'uuid'
import Alert from '../../components/alert'
import styled from '@emotion/styled'
import Table from '../../components/table'
import Code from '../../components/code'
import { LeadParagraph } from '../../components/type'
import { Flex, Box } from '@rebass/grid/emotion'
import { ButtonLooksLikeLink } from '../../components/button'
import { FormInput, FormSelect, FormSubmit } from '../../components/forms'
import allTimezones from 'moment-timezone/data/packed/latest.json'
import moment from 'moment-timezone'
import colors from '../../style/colors'
import Preview from './preview'
import ReactLoading from 'react-loading'

const SampleFlex = styled(Flex)`
  border-top: ${colors.primary.dark} 2px solid;
`

const PreviewBox = styled(Box)`
  background: ${colors.primary.dark};
  color: #fff;
`

const timezoneList = []
allTimezones.zones.forEach(zone => {
  zone = zone.split('|')
  timezoneList.push(zone[0])
})

const sampleData = `2009-01-01 13:00:00, 1.23
2009-01-01 14:00:00, -1.150
2009-01-01 15:00:00, 1.53`

const getTime = (time, timeFormat, dataTimezone) => {
  timeFormat = timeFormat ? timeFormat : 'timestamp'
  dataTimezone = dataTimezone ? dataTimezone : 'Etc/UTC'
  let timestamp = 0
  if (timeFormat === 'timestamp') {
    timestamp = time
  }
  return moment
    .unix(timestamp)
    .tz(dataTimezone)
    .toISOString(true)
}

const parseLevels = (
  levels,
  delimiter,
  units,
  timeFormat,
  dataTimezone,
  limit
) => {
  delimiter = typeof delimiter !== 'undefined' ? delimiter : ','
  units = typeof units !== 'undefined' ? units : 'metric'
  limit = typeof limit !== 'undefined' ? limit - 1 : false
  timeFormat = typeof timeFormat !== 'undefined' ? timeFormat : 'timestamp'
  const results = []
  let error = false
  levels.split(/\n/).forEach((level, index) => {
    if (error) {
      return
    }
    if (level.split(delimiter).length !== 2) {
      error = `Line ${index + 1} does not contain the delimiter "${delimiter}".`
      return
    }
    const height = parseFloat(level.split(delimiter)[1].trim())
    const time = getTime(
      level.split(delimiter)[0].trim(),
      timeFormat,
      dataTimezone
    )
    if (!time) {
      error = `Line ${index + 1} has an un-parseable time.`
    }
    if (limit && index >= limit) {
      return
    }
    results.push({
      t: time,
      v: units === 'metric' ? height : height / 3.2808
    })
  })
  return {
    results: results,
    error: error
  }
}

const HarmonicsPage = ({ data }) => {
  const [levels, setLevels] = useState(false)
  const [id, setId] = useState(false)
  const [units, setUnits] = useState('metric')
  const [delimiter, setDelimiter] = useState(',')
  const [dataTimezone, setDataTimezone] = useState('Etc/UTC')
  const [timeFormat, setTimeFormat] = useState('timestamp')
  const [harmonics, setHarmonics] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isProcessing) {
      return
    }

    const checkStatus = () => {
      if (typeof window === 'undefined') {
        return
      }
      fetch(`${data.site.siteMetadata.harmonicsServer}status/${id}`)
        .then(response => {
          return response.json()
        })
        .then(status => {
          if (status.done) {
            setTimeout(() => {
              fetch(`${data.site.siteMetadata.harmonicsServer}get/${id}`)
                .then(response => {
                  return response.json()
                })
                .then(results => {
                  setHarmonics(results)
                  setIsProcessing(false)
                })
                .catch(error => {
                  console.log('Get error')
                  setTimeout(checkStatus, 2000)
                })
            }, 2000)
            return
          }
          setTimeout(checkStatus, 2000)
        })
        .catch(error => {
          console.log('Status check error')
          setTimeout(checkStatus, 2000)
        })
    }
    checkStatus()
  }, [isProcessing])

  return (
    <Layout title="Generate tide harmonics">
      {isProcessing ? (
        <ProcessingMessage />
      ) : (
        <>
          {harmonics ? (
            <Preview
              harmonics={harmonics}
              id={id}
              dataTimezone={dataTimezone}
              levels={parseLevels(
                levels,
                delimiter,
                units,
                timeFormat,
                dataTimezone
              )}
            />
          ) : (
            <SampleFlex>
              <Box width={[1 / 2]} p={4}>
                <Container>
                  <form
                    onSubmit={event => {
                      event.preventDefault()
                      setIsUploading(true)
                      const id = uuid()
                      const waterlevels = parseLevels(
                        levels,
                        delimiter,
                        units,
                        timeFormat,
                        dataTimezone
                      )
                      fetch(
                        `${data.site.siteMetadata.harmonicsServer}generate`,
                        {
                          method: 'POST',
                          mode: 'cors',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            uuid: id,
                            levels: waterlevels.results
                          })
                        }
                      ).then(response => {
                        setId(id)
                        setIsProcessing(true)
                      })
                    }}
                  >
                    {!levels ? (
                      <>
                        <h3 id="data-file-label">Data file</h3>
                        <p>
                          Tide constituents should be derived from good data
                          that is sampled at least once an hour, and over a year
                          or more.
                        </p>
                        <p>
                          Your file should be in a simple CSV format, without
                          quotes:
                        </p>
                        <Code code={sampleData} language="text" />
                        <FormInput
                          type="file"
                          aria-labelledby="data-file-label"
                          onChange={event => {
                            const reader = new FileReader()
                            reader.onloadend = function() {
                              setLevels(reader.result)
                            }
                            reader.readAsText(event.target.files[0])
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <p>
                          <ButtonLooksLikeLink
                            onClick={event => {
                              event.preventDefault()
                              setLevels(false)
                            }}
                          >
                            Start over
                          </ButtonLooksLikeLink>
                        </p>
                        <label htmlFor="delimiter">Field delimiter</label>
                        <FormInput
                          id="delimiter"
                          defaultValue=","
                          onChange={event => {
                            setDelimiter(event.target.value)
                          }}
                        />
                        <label htmlFor="units">Units</label>
                        <FormSelect
                          id="units"
                          onChange={event => {
                            setUnits(event.target.value)
                          }}
                        >
                          <option value="metric">Metric</option>
                          <option value="english">English</option>
                        </FormSelect>
                        <label htmlFor="time-format">Time format</label>
                        <FormSelect
                          id="time-format"
                          onChange={event => {
                            setTimeFormat(event.target.value)
                          }}
                        >
                          <option value="timestamp">UNIX timestamp</option>
                        </FormSelect>
                        <label htmlFor="timezone_data">Timezone of data</label>
                        <FormSelect
                          id="timezone_data"
                          onChange={event => {
                            setDataTimezone(event.target.value)
                          }}
                        >
                          <option value="Etc/UTC">UTC/GMT</option>
                          {timezoneList.map(timezone => (
                            <option key={timezone} value={timezone}>
                              {timezone}
                            </option>
                          ))}
                        </FormSelect>
                        {isUploading ? (
                          <FormSubmit
                            value="Uploading data"
                            disabled="disabled"
                          />
                        ) : (
                          <FormSubmit value="Confirm data" />
                        )}
                      </>
                    )}
                  </form>
                </Container>
              </Box>
              <PreviewBox width={[1 / 2]} p={4}>
                <h3>Preview</h3>
                {levels && (
                  <>
                    {parseLevels(
                      levels,
                      delimiter,
                      units,
                      timeFormat,
                      dataTimezone,
                      10
                    ).error ? (
                      <Alert>
                        {
                          parseLevels(
                            levels,
                            delimiter,
                            units,
                            timeFormat,
                            dataTimezone,
                            10
                          ).error
                        }
                      </Alert>
                    ) : (
                      <>
                        <p>All dates are in UTC, heights in meters.</p>
                        <Table light={true}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parseLevels(
                              levels,
                              delimiter,
                              units,
                              timeFormat,
                              dataTimezone,
                              10
                            ).results.map((level, index) => (
                              <tr key={`preview-${index}`}>
                                <td>{level.t}</td>
                                <td>{level.v}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </>
                    )}
                  </>
                )}
              </PreviewBox>
            </SampleFlex>
          )}
        </>
      )}
    </Layout>
  )
}

const ProcessingMessage = () => (
  <Container>
    <LeadParagraph>
      Neaps is generating harmonic data. This might take a while.
    </LeadParagraph>
    <ReactLoading type="bubbles" height={150} width={150} />
  </Container>
)

export default HarmonicsPage

export const query = graphql`
  {
    site {
      siteMetadata {
        harmonicsServer
      }
    }
  }
`
