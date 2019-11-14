import React, { useState, useEffect, useRef } from 'react'
import Layout from '../../components/layout/default'
import Container from '../../components/container'
import { graphql } from 'gatsby'
import slugify from 'slugify'
import { Flex, Box } from '@rebass/grid/emotion'
import {
  FormInput,
  FormSelect,
  FormSubmit,
  TextareaInput
} from '../../components/forms'
import { Map, Marker, TileLayer } from 'react-leaflet'
import url from 'url'
import colors from '../../style/colors'
import 'leaflet/dist/leaflet.css'
import styled from '@emotion/styled'
import countries from 'country-list'
import allTimezones from 'moment-timezone/data/packed/latest.json'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const timezoneList = ['UTC/GMT']
allTimezones.zones.forEach(zone => {
  zone = zone.split('|')
  timezoneList.push(zone[0])
})

const countryList = countries.getCodeList()

const FormHeader = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  border-bottom: 1px solid #000;
`

const StationID = styled.span`
  font-family: monospace;
  display: inline-block;
  padding: 0.2rem;
  color: #fff;
  background: ${colors.primary.dark};
`

const FormHelp = styled.p`
  font-size: 0.8rem;
  margin-bottom: 0;
`

const generateStationId = name => {
  return slugify(name)
    .toLowerCase()
    .replace(/([^0-9a-z-])/g, '')
}

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

  const locationLatitudeRef = useRef(null)
  const locationLongitudeRef = useRef(null)

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
      <Container>
        <p>Submit your tide data to the Neaps tide harmonics database.</p>

        <form
          onSubmit={event => {
            event.preventDefault()
            setIsBuildingPr(true)
            const station = {
              name: name,
              id: generateStationId(name),
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
          <p>
            This station's ID will be{' '}
            {name && <StationID>{generateStationId(name)}</StationID>}
          </p>

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

          <FormHeader>Location</FormHeader>
          <Flex flexWrap="wrap">
            <Box width={[1, 1 / 2]} pr={[0, 3]}>
              <p>Use decimal degress, you can also select a point on the map</p>
              <label htmlFor="latitude">Latitude</label>
              <FormInput
                type="text"
                name="latitude"
                id="latitude"
                ref={locationLatitudeRef}
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
                ref={locationLongitudeRef}
                onChange={event => {
                  location.longitude = event.target.value
                  setLocation(location)
                }}
              />

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
            </Box>
            <Box width={[1, 1 / 2]}>
              {typeof window !== 'undefined' && (
                <Map
                  style={{ width: '100%', height: '300px' }}
                  center={[location.latitude, location.longitude]}
                  zoom={9}
                  onClick={event => {
                    location.latitude = event.latlng.lat
                    location.longitude = event.latlng.lng
                    setLocation(location)
                    locationLatitudeRef.current.value = location.latitude
                    locationLongitudeRef.current.value = location.longitude
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {location.latitude !== 0 && location.longitude !== 0 && (
                    <Marker
                      position={[location.latitude, location.longitude]}
                    />
                  )}
                </Map>
              )}
            </Box>
          </Flex>

          <FormHeader>Data source</FormHeader>
          <p>Let us know where this data came from.</p>
          <label htmlFor="source-name">Source name</label>
          <FormHelp>
            The name of the agency or entity who generated this water level
            data.
          </FormHelp>
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
          <FormHelp>The agency or organization's main website.</FormHelp>
          <FormInput
            type="text"
            name="source-url"
            id="source-url"
            onChange={event => {
              source.url = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-source_url">URL of the specific station</label>
          <FormHelp>The webpage for the specific tide station.</FormHelp>
          <FormInput
            type="text"
            name="source-source_url"
            id="source-source_url"
            onChange={event => {
              source.source_url = event.target.value
              setSource(source)
            }}
          />

          <label htmlFor="source-id">Station ID</label>
          <FormHelp>
            The internal station ID used by the agency (i.e. NOAA stations have
            unique numeric IDs).
          </FormHelp>
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
          <FormHelp>
            Briefly describe any license restrictions, and provide a URL if
            possible for more information.
          </FormHelp>
          <FormInput
            type="text"
            name="source-license"
            id="source-license"
            onChange={event => {
              source.license = event.target.value
              setSource(source)
            }}
          />

          <FormHeader>Your information</FormHeader>
          <p>
            You will be contacted with any questions, or when your request is
            approved. This information{' '}
            <a
              href="https://github.com/neaps/tide-database"
              target="_blank"
              rel="noopener noreferrer"
            >
              will be publically available on our Github pull requests
            </a>
            .
          </p>
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

          <label htmlFor="contact-notes">Additional notes</label>
          <FormHelp>Let us know anything about this request.</FormHelp>
          <TextareaInput
            type="text"
            name="contact-notes"
            id="contact-notes"
            onChange={event => {
              contact.notes = event.target.value
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
