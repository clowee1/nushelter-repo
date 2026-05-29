import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const LOCATIONS = [
  { id: 'com1', name: 'COM1 Lobby', capacity: 5, available: 3 },
  { id: 'utown', name: 'UTown Promenade', capacity: 4, available: 1 },
  { id: 'library', name: 'Central Library', capacity: 6, available: 5 },
  { id: 'science', name: 'Science Faculty', capacity: 3, available: 0 },
  { id: 'fass', name: 'FASS Building', capacity: 5, available: 3 },
]

function DonateLocationPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [location, setLocation] = useState('')

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Donate an Umbrella</h1>
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
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{loc.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{loc.capacity} rack capacity · {loc.available} currently available</p>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
          <button
            onClick={() => location && navigate('/donate/review', { state: { ...state, location, locationName: LOCATIONS.find(l => l.id === location)?.name } })}
            style={{ flex: 1, padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: location ? 1 : 0.4 }}>
            Next
          </button>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        {[{icon:'🗺️',label:'Map'},{icon:'☂️',label:'Borrow'},{icon:'🎁',label:'Donate'},{icon:'👤',label:'Profile'}].map(tab => (
          <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '22px' }}>{tab.icon}</div>
            <p style={{ margin: 0, fontSize: '11px', color: tab.label === 'Donate' ? '#1a3a33' : '#888' }}>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonateLocationPage