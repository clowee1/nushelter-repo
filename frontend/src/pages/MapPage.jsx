import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BottomNav from '../components/BottomNav'

const NUS_CENTRE = [1.2966, 103.7764]

const FALLBACK_RACK_COORDINATES = {
  'com1 lobby': [1.29484, 103.77377],
  'utown bus stop': [1.30445, 103.77249],
  'central library': [1.29661, 103.77206],
  lt27: [1.2955, 103.78036],
  'raffles hall': [1.30053, 103.77293],
  'fass bus stop': [1.29538, 103.77018]
}

const getStationPosition = station => {
  const lat = station.lat ?? station.latitude
  const lon = station.lon ?? station.longitude

  if (lat != null && lon != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon))) {
    return [Number(lat), Number(lon)]
  }

  return FALLBACK_RACK_COORDINATES[station.name?.trim().toLowerCase()] ?? null
}

function MapFocus({ station }) {
  const map = useMap()

  useEffect(() => {
    if (station?.mapPosition) map.flyTo(station.mapPosition, 17, { duration: 0.7 })
  }, [map, station])

  return null
}

function MapPage() {
  const navigate = useNavigate()
  const [stations, setStations] = useState([])
  const [selectedStation, setSelectedStation] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/stations')
      .then(res => res.json())
      .then(data => setStations(data))
      .catch(() => {})
  }, [])

  const mappedStations = useMemo(
    () => stations.map(station => ({ ...station, mapPosition: getStationPosition(station) })).filter(station => station.mapPosition),
    [stations]
  )

  const getAvailabilityColor = (current, capacity) => {
    const ratio = Number(current) / Number(capacity)
    if (ratio === 0) return '#dc2626'
    if (ratio <= 0.3) return '#d97706'
    return '#15803d'
  }

  const rackIcon = station => {
    const color = getAvailabilityColor(station.current_count, station.capacity)
    return L.divIcon({
      className: '',
      html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);color:white;font-size:17px;display:flex;align-items:center;justify-content:center;transform:rotate(-45deg)"><span style="transform:rotate(45deg)">☂</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 31],
      popupAnchor: [0, -32]
    })
  }

  const selectStation = station => setSelectedStation({ ...station, mapPosition: station.mapPosition ?? getStationPosition(station) })

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: 'white' }}>Nearby Stations</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Tap a rack pin to view its live availability</p>
      </div>

      <div style={{ height: '340px', backgroundColor: '#d4e8e0', position: 'relative' }}>
        <MapContainer center={NUS_CENTRE} zoom={15} scrollWheelZoom style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapFocus station={selectedStation} />
          {mappedStations.map(station => (
            <Marker key={station.station_id} position={station.mapPosition} icon={rackIcon(station)} eventHandlers={{ click: () => selectStation(station) }}>
              <Popup>
                <strong>{station.name}</strong><br />
                <span style={{ color: getAvailabilityColor(station.current_count, station.capacity) }}>{station.current_count}/{station.capacity} umbrellas available</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {stations.length > 0 && mappedStations.length === 0 && (
          <p style={{ position: 'absolute', zIndex: 1, bottom: '8px', left: '16px', right: '16px', margin: 0, padding: '10px', borderRadius: '8px', backgroundColor: 'white', fontSize: '12px', color: '#555' }}>
            This station list has no usable coordinates yet.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', padding: '12px 20px', backgroundColor: 'white', fontSize: '12px', color: '#555' }}>
        <span><b style={{ color: '#15803d' }}>●</b> Available</span>
        <span><b style={{ color: '#d97706' }}>●</b> Low stock</span>
        <span><b style={{ color: '#dc2626' }}>●</b> Empty</span>
      </div>

      <div style={{ backgroundColor: 'white', marginTop: '1px' }}>
        {stations.map((station, i) => (
          <div key={station.station_id}
            onClick={() => selectStation(station)}
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', borderBottom: i < stations.length - 1 ? '1px solid #f0f0f0' : 'none', backgroundColor: selectedStation?.station_id === station.station_id ? '#f0f5f3' : 'white' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#f0f5f3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>☂️</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>{station.name}</p>
              <p style={{ margin: 0, fontSize: '13px', color: getAvailabilityColor(station.current_count, station.capacity), fontWeight: '600' }}>
                {station.current_count}/{station.capacity} available
              </p>
            </div>
            <button onClick={(event) => { event.stopPropagation(); navigate('/borrow') }} style={{ color: '#1a3a33', background: 'none', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Borrow</button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

export default MapPage
