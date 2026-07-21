import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'

function DonateLocationPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [location, setLocation] = useState(null)
  const [stations, setStations] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/stations')
      .then(res => res.json())
      .then(data => setStations(data))
      .catch(() => {})

    fetch('http://127.0.0.1:5000/recommended-drop-off?lat=1.2966&lon=103.7764', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []))
      .catch(() => {})
  }, [])

  const isAiPick = (station_id) => recommendations.some(r => r.station_id === station_id)

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: 'white' }}>Donate an Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Help keep NUS dry, one umbrella at a time.</p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: n <= 3 ? 'white' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>Where will you drop it off?</h2>

        {stations.length === 0 && (
          <p style={{ color: '#aaa', textAlign: 'center' }}>Loading stations...</p>
        )}

        {stations.map(loc => (
          <div key={loc.station_id} onClick={() => setLocation(loc.station_id)}
            style={{
              borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer',
              border: `1.5px solid ${location === loc.station_id ? '#1a3a33' : isAiPick(loc.station_id) ? '#1a3a33' : '#e0e0e0'}`,
              backgroundColor: location === loc.station_id ? '#f0f5f3' : isAiPick(loc.station_id) ? '#f8fffe' : 'white'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${location === loc.station_id ? '#1a3a33' : '#ccc'}`, backgroundColor: location === loc.station_id ? '#1a3a33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {location === loc.station_id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px', flex: 1 }}>{loc.name}</span>
              {isAiPick(loc.station_id) && (
                <span style={{ backgroundColor: '#1a3a33', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>AI Pick</span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#888', paddingLeft: '28px' }}>
              {loc.capacity} rack capacity · {loc.current_count} currently available
            </p>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
          <button
            onClick={() => {
              if (!location) return
              const selectedLoc = stations.find(l => l.station_id === location)
              navigate('/donate/review', {
                state: {
                  ...state,
                  locationName: selectedLoc.name,
                  location_id: selectedLoc.station_id
                }
              })
            }}
            style={{ flex: 1, padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: location ? 1 : 0.4 }}>
            Next
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default DonateLocationPage