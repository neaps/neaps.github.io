import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { graphql } from 'gatsby'
import slugify from 'slugify'
import { Flex, Box } from '@rebass/grid/emotion'
import { FormInput, FormSelect, FormSubmit } from '../../components/forms'
import { Map, Marker, TileLayer } from 'react-leaflet'
import url from 'url'
import 'leaflet/dist/leaflet.css'
import styled from '@emotion/styled'
import countries from 'country-list'
import allTimezones from 'moment-timezone/data/packed/latest.json'

const timezoneList = ['UTC/GMT']
allTimezones.zones.forEach(zone => {
  zone = zone.split('|')
  timezoneList.push(zone[0])
})

const countryList = countries.getCodeList()

const FormHelp = styled.p`
  font-size: 0.8rem;
  margin-bottom: 0;
`

const SubmitHarmonics = ({ data }) => {
  const [harmonics, setHarmonics] = useState(false)
  const [source, setSource] = useState({})
  const [name, setName] = useState(false)
  const [country, setCountry] = useState(false)
  const [timezone, setTimezone] = useState('Etc/UTC')
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
  const [contact, setContact] = useState({})
  const [isBuildingPr, setIsBuildingPr] = useState(false)
  const [prUrl, setPrUrl] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const parsedUrl = url.parse(window.location.href, true)
    fetch(`${data.site.siteMetadata.harmonicsServer}get/${parsedUrl.query.id}`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setHarmonics(data)
      })
  }, [])

  return (
    <Layout title="Submit harmonic data">
      <p>Submit your tide data to the Neaps tide harmonics database.</p>
      <Container>
        <form
          onSubmit={event => {
            event.preventDefault()
            setIsBuildingPr(true)
            const station = {
              name: name,
              id: slugify(name).toLowerCase(),
              country: country,
              timezone: timezone,
              latitude: location.latitude,
              longitude: location.longitude,
              type: 'reference',
              source: source,
              harmonic_constituents: []
            }
            station.source.published_harmonics = false
            Object.keys(harmonics).forEach(name => {
              station.harmonic_constituents.push({
                name: name,
                phase_UTC: harmonics[name].phase,
                amplitude: harmonics[name].amplitude
              })
            })
            fetch('https://neaps-tide-database-pr.herokuapp.com/', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contact: contact,
                station: station
              })
            })
              .then(response => {
                return response.json()
              })
              .then(pr => {
                if (!pr.error) {
                  setPrUrl(pr.url)
                }
              })
          }}
        >
          <p>We now need some basic information about this tide station.</p>
          <label htmlFor="name">Station name</label>
          <FormInput
            type="text"
            name="name"
            id="name"
            onChange={event => {
              setName(event.target.value)
            }}
          />
          <label htmlFor="slug">Station ID</label>
          {name && (
            <p>This station's ID will be {slugify(name).toLowerCase()}</p>
          )}

          <label htmlFor="timezone">Timezone</label>
          <FormSelect
            id="timezone"
            onChange={event => {
              setTimezone(event.target.value)
            }}
          >
            {timezoneList.map(timezone => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </FormSelect>

          <h3>Location</h3>
          <Flex>
            <Box width={[1, 1 / 2]} pr={[0, 3]}>
              <p>Use decimal degress, you can also select a point on the map</p>
              <label htmlFor="latitude">Latitude</label>
              <FormInput
                type="text"
                name="latitude"
                id="latitude"
                onChange={event => {
                  location.latitude = event.target.value
                  setLocation(location)
                }}
              />
              <label htmlFor="longitude">Longitude</label>
              <FormInput
                type="text"
                name="longitude"
                id="longitude"
                onChange={event => {
                  location.longitude = event.target.value
                  setLocation(location)
                }}
              />
            </Box>
            <Box width={[1, 1 / 2]}>
              {typeof window !== 'undefined' && (
                <Map
                  style={{ width: '100%', height: '250px' }}
                  center={[location.latitude, location.longitude]}
                  zoom={9}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[location.latitude, location.longitude]} />
                </Map>
              )}
            </Box>
          </Flex>
          <label htmlFor="country">Country</label>
          <FormSelect
            onChange={event => {
              setCountry(event.target.value.toLowerCase())
            }}
          >
            {Object.keys(countryList).map(code => (
              <option value={code}>{countryList[code]}</option>
            ))}
          </FormSelect>
          <h3>Data source</h3>
          <p>Let us know where this data came from.</p>
          <label htmlFor="source-name">Source name</label>
          <FormHelp>The name of the agency who generated this data.</FormHelp>
          <FormInput
            type="text"
            name="source-name"
            id="source-name"
            onChange={event => {
              source.name = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-url">URL of the agency</label>
          <FormInput
            type="text"
            name="source-url"
            id="source-url"
            onChange={event => {
              source.url = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-id">Station ID</label>
          <FormHelp>The internal station ID used by the agency.</FormHelp>
          <FormInput
            type="text"
            name="source-id"
            id="source-id"
            onChange={event => {
              source.id = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-license">License information</label>
          <FormInput
            type="text"
            name="source-license"
            id="source-license"
            onChange={event => {
              source.license = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-source_url">URL of the specific station</label>
          <FormInput
            type="text"
            name="source-source_url"
            id="source-source_url"
            onChange={event => {
              source.source_url = event.target.value
              setSource(source)
            }}
          />

          <h3>Your information</h3>
          <label htmlFor="contact-email">Email address</label>
          <FormInput
            type="text"
            name="contact-email"
            id="contact-email"
            onChange={event => {
              contact.email = event.target.value
              setContact(contact)
            }}
          />

          {isBuildingPr ? (
            <>
              {prUrl ? (
                <a href={prUrl} rel="noopener noreferrer" target="_blank">
                  View your request
                </a>
              ) : (
                <p>Preparing your request</p>
              )}
            </>
          ) : (
            <FormSubmit value="Submit tide information" />
          )}
        </form>
      </Container>
    </Layout>
  )
}

export default SubmitHarmonics

export const query = graphql`
  {
    site {
      siteMetadata {
        harmonicsServer
      }
    }
  }
`
