import React, { useEffect, useRef, useImperativeHandle } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import "./map.css"

// export default function MapView({ geometry }) {

const MapView = React.forwardRef(({ geometry }, ref) => {
  const mapContainerRef = useRef()
  const mapRef = useRef()
  const key = "kyJTe4pPzUcqqrqrbs7Y"
  const key2 = "50ba4d648cc1f275"
  useEffect(() => {
    console.log("Geometry prop:", geometry)

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.protomaps.com/styles/v2/white.json?key=${key2}`,
      // style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
      center: [-0.12755, 51.507222],
      zoom: 13.8,
    })

    map.addControl(new maplibregl.NavigationControl(), "top-right")
    mapRef.current = map
    map.on("load", () => {
      for (const [key, value] of geometry) {
        let id = key.toString()
        map.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [value.lng, value.lat],
            },
          },
        })

        map.on("mouseenter", id, () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", id, () => {
          map.getCanvas().style.cursor = ""
        })

        map.on("click", id, function (e) {
          console.log(id, document.getElementById(id))
          document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
          })
          document.getElementById(id).style.backgroundColor = "#e5e5e5"
          setTimeout(() => {
            document.getElementById(id).style.backgroundColor = ""
          }, 2000)
        })
        map.addLayer({
          id: id,
          type: "circle",
          source: id,
          paint: {
            "circle-radius": 5,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#000",
            "circle-color": "#ee352e",
          },
        })
      }
    })

    return () => {
      map.remove()
    }
  }, [geometry])

  useImperativeHandle(ref, () => ({
    flyTo({ lat, lng }) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 25,
        essential: true, // Animation for accessibility
      })
    },
  }))

  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark">
        <img
          src="https://api.maptiler.com/resources/logo.svg"
          alt="MapTiler logo"
        />
      </a>
      <div ref={mapContainerRef} className="map" />
    </div>
  )
})

export default MapView
