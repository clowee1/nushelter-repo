import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import BottomNav from '../components/BottomNav'

const LOCATIONS = [
  { id: 1, name: 'COM1 Lobby', capacity: 10, available: 0 },
  { id: 2, name: 'UTown Bus Stop', capacity: 10, available: 0 },
  { id: 3, name: 'Central Library', capacity: 10, available: 0 },
  { id: 4, name: 'LT27', capacity: 10, available: 0 },
  { id: 5, name: 'Raffles Hall', capacity: 10, available: 0 },
  { id: 6, name: 'FASS Bus Stop', capacity: 10, available: 0 },
]

function DonateLocationPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [location, setLocation] = useState(null)

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

        {LOCATIONS.map(loc => (
          <div key={loc.id} onClick={() => setLocation(loc.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', border: `1.5px solid ${location === loc.id ? '#1a3a33' : '#e0e0e0'}`, backgroundColor: location === loc.id ? '#f0f5f3' : 'white', marginBottom: '10px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${location === loc.id ? '#1a3a33' : '#ccc'}`, backgroundColor: location === loc.id ? '#1a3a33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {location === loc.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', textAlign: 'left' }}>{loc.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{loc.capacity} rack capacity · {loc.available} currently available</p>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
          <button
            onClick={() => {
              if (!location) return
              const selectedLoc = LOCATIONS.find(l => l.id === location)
              navigate('/donate/review', {
                state: {
                  ...state,
                  location: selectedLoc.name,
                  locationName: selectedLoc.name,
                  location_id: selectedLoc.id
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