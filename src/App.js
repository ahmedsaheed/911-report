import React, { useEffect } from 'react'
import MapView from './components/map.js'
import './App.css'

function App() {
  const [callstream, setCallstream] = React.useState([])
  const [coordinates, setCoordinates] = React.useState(new Map())
  const [loading, setLoading] = React.useState(true)

  const getCoordinates = async address => {
    let encodedAddress = encodeURIComponent(address)
    encodedAddress += '%20nashville%20tennessee%20united%20states'
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en&=`
    )
    const data = await response.json()
    return { formatted: data.results[0].formatted, geometry: data.results[0].geometry }
  }

  useEffect(() => {
    fetch(
      'https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Metro_Nashville_Police_Department_Active_Dispatch_Table_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    )
      .then(response => response.json())
      .then(data => {
        setCallstream(data.features)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (callstream.length > 0) {
      callstream.forEach(call => {
        getCoordinates(call.attributes.Location).then(data => {
          setCoordinates(prevState => new Map(prevState.set(call.attributes.Location, data)))
        })
      })
    }
  }, [callstream])

  return (
    <div className="App">
      <div className="main">
        <div className="left">
          <div id="banner">
            <a href="#" id="name">
              Public Data Experiment by Ahmed
            </a>
            <h2 id="sf">The State of Tennessee</h2>
            <h2 id="nine" style={{ color: '#ee352e' }}>
              Nashville 911 call stream
            </h2>
            <p id="desc">
              The state government provides dataset of active major incident calls for service dispatched to Metro
              Nashville Police Department. These dataset are updated at regular intervals - about 30min. This website
              displays calls from the past 4 hours. Last updated less than a minute ago.
              <br />
              <br />
              For privacy reasons, the dataset includes each call's location as the closest intersection. Some calls are
              marked as sensitive and therefore no location is given.
            </p>
            <br />
          </div>

          <div id="calls">
            {loading ? (
              <div>Loading...</div>
            ) : (
              callstream.map(call => {
                return (
                  <div className="call">
                    <div className="type" style={{ fontWeight: 'bold' }}>
                      {call.attributes.IncidentTypeName}
                    </div>
                    <div className="time">
                      reported at{' '}
                      {new Date(call.attributes.CallReceivedTime)
                        .toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        .toLowerCase()
                        .trim()}
                    </div>
                    <div className="address">
                      {' '}
                      on{' '}
                      {coordinates.has(call.attributes.Location)
                        ? coordinates
                            .get(call.attributes.Location)
                            .formatted.toLowerCase()
                            .replace(/, united states of america/g, '')
                        : 'Loading...'}
                    </div>
                    <hr />
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className="right">{coordinates.size && !loading && <MapView geometry={coordinates} />}</div>
      </div>
    </div>
  )
}

export default App
