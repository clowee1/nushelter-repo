import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const LOCATIONS = [
  { id: 1, name: 'COM1 Lobby', capacity: 10, available: 0, need: 'High Need', needColor: 'red', aiPick: true },
  { id: 2, name: 'UTown Bus Stop', capacity: 10, available: 0, need: 'High Need', needColor: 'red', aiPick: true },
  { id: 3, name: 'Central Library', capacity: 10, available: 0, need: 'Moderate', needColor: '#d97706', aiPick: false },
  { id: 4, name: 'LT27', capacity: 10, available: 0, need: 'Low Need', needColor: '#1a3a33', aiPick: false },
  { id: 5, name: 'Raffles Hall', capacity: 10, available: 0, need: 'Low Need', needColor: '#1a3a33', aiPick: false },
  { id: 6, name: 'FASS Bus Stop', capacity: 10, available: 0, need: 'Low Need', needColor: '#1a3a33', aiPick: false },
]

function ReturnLocationPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')
  const activeBorrow = JSON.parse(localStorage.getItem('activeBorrow') || 'null')

  const getBarWidth = (available, capacity) => {
    const fill = ((capacity - available) / capacity) * 100
    return `${fill}%`
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Profile</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Return Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>{activeBorrow?.code} · {activeBorrow?.name}</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        {/* AI Banner */}
        <div style={{ backgroundColor: '#f0f5f3', border: '1.5px solid #1a3a33', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px' }}>🤖</span>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '14px', color: '#1a3a33' }}>Smart Drop Zone Recommendations</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Highlighted stations have the highest demand. Returning here helps redistribute umbrellas evenly across campus.</p>
          </div>
        </div>

        <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '12px' }}>CHOOSE RETURN LOCATION</label>

        {LOCATIONS.map(loc => (
          <div key={loc.id} onClick={() => setSelected(loc.id)}
            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: `1.5px solid ${selected === loc.id ? '#1a3a33' : loc.aiPick ? '#1a3a33' : '#e0e0e0'}`, backgroundColor: selected === loc.id ? '#f0f5f3' : loc.aiPick ? '#f8fffe' : 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${selected === loc.id ? '#1a3a33' : '#ccc'}`, backgroundColor: selected === loc.id ? '#1a3a33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selected === loc.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px', flex: 1 }}>{loc.name}</span>
              {loc.aiPick && <span style={{ backgroundColor: '#1a3a33', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>AI Pick</span>}
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#888', paddingLeft: '28px' }}>{loc.available}/{loc.capacity} currently available</p>
            <div style={{ paddingLeft: '28px' }}>
              <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '4px', marginBottom: '4px' }}>
                <div style={{ width: getBarWidth(loc.available, loc.capacity), height: '100%', backgroundColor: loc.needColor, borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: loc.needColor }}>{loc.need}</span>
            </div>
          </div>
        ))}

        <button
          onClick={() => selected && navigate('/return/note', { state: { location: LOCATIONS.find(l => l.id === selected) } })}
          style={{ width: '100%', padding: '16px', backgroundColor: selected ? '#1a3a33' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: selected ? 'pointer' : 'not-allowed', marginTop: '8px' }}>
          Continue
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default ReturnLocationPage