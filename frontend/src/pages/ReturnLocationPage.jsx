import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function ReturnLocationPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const activeBorrow = JSON.parse(localStorage.getItem('activeBorrow') || 'null')

  useEffect(() => {
    fetch('http://127.0.0.1:5000/stations')
      .then(res => {
        if (!res.ok) throw new Error('Could not load stations')
        return res.json()
      })
      .then(data => setLocations(data))
      .catch(() => setLocations([]))
      .finally(() => setLoading(false))
  }, [])

  const getBarWidth = (available, capacity) => {
    const fill = ((capacity - available) / capacity) * 100
    return `${fill}%`
  }

  const getNeed = location => {
    const ratio = Number(location.current_count) / Number(location.capacity)
    if (ratio <= 0.3) return { label: 'High Need', color: 'red' }
    if (ratio <= 0.6) return { label: 'Moderate', color: '#d97706' }
    return { label: 'Low Need', color: '#1a3a33' }
  }

  const recommendedIds = new Set(
    [...locations]
      .sort((a, b) => Number(a.current_count) - Number(b.current_count))
      .slice(0, 2)
      .map(location => location.station_id)
  )

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Profile</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: 'white'}}>Return Umbrella</h1>
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

        {loading && <p style={{ color: '#888', textAlign: 'center' }}>Loading live station availability...</p>}
        {!loading && locations.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Could not load live station availability.</p>}
        {locations.map(loc => {
          const need = getNeed(loc)
          const aiPick = recommendedIds.has(loc.station_id)
          return (
          <div key={loc.station_id} onClick={() => setSelected(loc.station_id)}
            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '10px', cursor: 'pointer', border: `1.5px solid ${selected === loc.station_id ? '#1a3a33' : aiPick ? '#1a3a33' : '#e0e0e0'}`, backgroundColor: selected === loc.station_id ? '#f0f5f3' : aiPick ? '#f8fffe' : 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${selected === loc.station_id ? '#1a3a33' : '#ccc'}`, backgroundColor: selected === loc.station_id ? '#1a3a33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selected === loc.station_id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px', flex: 1 }}>{loc.name}</span>
              {aiPick && <span style={{ backgroundColor: '#1a3a33', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>AI Pick</span>}
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#888', paddingLeft: '28px' }}>{loc.current_count}/{loc.capacity} currently available</p>
            <div style={{ paddingLeft: '28px' }}>
              <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '4px', marginBottom: '4px' }}>
                <div style={{ width: getBarWidth(loc.current_count, loc.capacity), height: '100%', backgroundColor: need.color, borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: need.color }}>{need.label}</span>
            </div>
          </div>
        )})}

        <button
          onClick={() => selected && navigate('/return/note', { state: { location: locations.find(l => l.station_id === selected) } })}
          style={{ width: '100%', padding: '16px', backgroundColor: selected ? '#1a3a33' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: selected ? 'pointer' : 'not-allowed', marginTop: '8px' }}>
          Continue
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default ReturnLocationPage
