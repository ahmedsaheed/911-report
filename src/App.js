import React, { useEffect } from "react"
import MapView from "./components/map.js"
import "./App.css"

function App() {
  const [callstream, setCallstream] = React.useState([])
  const [coordinates, setCoordinates] = React.useState(new Map())
  const [loading, setLoading] = React.useState(true)
  const mapRef = React.useRef(null) // Reference for MapView

  useEffect(() => {
    fetch(
      "https://data.police.uk/api/crimes-street/all-crime?date=2024-10&lat=51.50853&lng=-0.12574",
    )
      .then((response) => response.json())
      .then((data) => {
        // now the data is alphabetically sorted, randomize it
        setCallstream(data.sort(() => Math.random() - 0.5))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (callstream.length > 0) {
      const newCoordinates = new Map()
      callstream.forEach((call) => {
        if (call.location.street.id) {
          newCoordinates.set(call.location.street.id, {
            lat: call.location.latitude,
            lng: call.location.longitude,
          })
          setCoordinates(newCoordinates)
        }
      })
    }
  }, [callstream])

  const handleCallClick = (streetId) => {
    const location = coordinates.get(streetId)
    if (location && mapRef.current) {
      mapRef.current.flyTo(location) // Call MapView's flyTo method
    }
  }
  return (
    <div className="App">
      <div className="main">
        <div className="left">
          <div id="banner">
            <a href="#" id="name">
              Public Data Experiment by Ahmed
            </a>
            <h2 id="sf">London City</h2>
            <h2 id="nine" style={{ color: "#ee352e" }}>
              Street Level Crime Data
            </h2>
            <p id="desc">
              The United Kingdom Police has made available a dataset of street
              level crime and This website displays calls from the past 4 hours.
              Last updated less than a minute ago.
              <br />
              <br />
              For privacy reasons, the dataset includes each call's location as
              the closest intersection. Some calls are marked as sensitive and
              therefore no location is given.
            </p>
            <br />
          </div>

          <div id="calls">
            {loading ? (
              <div>Loading...</div>
            ) : (
              callstream.map((call) => {
                return (
                  <div
                    className="call"
                    id={call.location.street.id}
                    onClick={() => handleCallClick(call.location.street.id)}
                  >
                    <div className="type" style={{ fontWeight: "bold" }}>
                      {call.category}
                    </div>
                    <div className="time">
                      reported at {getCalendarDate(call.month)}
                    </div>
                    <div className="address">
                      {" "}
                      {call.location.street.name.toLowerCase()}{" "}
                    </div>
                    <hr />
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className="right">
          {<MapView geometry={coordinates} ref={mapRef} />}
        </div>
      </div>
    </div>
  )
}

const getCalendarDate = (date) => {
  const [year, month] = date.split("-").map(Number)
  const calendarDate = new Date(year, month - 1, 1)
  return calendarDate.toDateString().toLowerCase()
}
export default App
