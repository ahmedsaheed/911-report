import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './map.css'

export default function MapView({ geometry }) {
  const mapContainerRef = useRef()
  const key = 'kyJTe4pPzUcqqrqrbs7Y'
  useEffect(() => {
    console.log('Geometry prop:', geometry)

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
      center: [-86.7816, 36.1627], // Nashville, TN
      zoom: 10.8
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    for (const [key, value] of geometry) {
      new maplibregl.Marker({ color: '#FF0000' }).setLngLat([value.geometry.lng, value.geometry.lat]).addTo(map)
    }

    return () => {
      map.remove()
    }
  }, [geometry])

  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark">
        <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
      </a>
      <div ref={mapContainerRef} className="map" />
    </div>
  )
}
