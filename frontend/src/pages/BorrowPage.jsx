import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_UMBRELLAS = {
  'NUS-017': { code: 'NUS-017', name: 'Striped Navy', location: 'UTown Promenade', studentsHelped: 23, locationsVisited: 4, daysActive: 41 },
  'NUS-042': { code: 'NUS-042', name: 'Blue Polka Dot', location: 'COM1 Lobby', studentsHelped: 47, locationsVisited: 6, daysActive: 82 },
  'NUS-103': { code: 'NUS-103', name: 'Forest Green', location: 'Central Library', studentsHelped: 12, locationsVisited: 3, daysActive: 20 },
}

function BorrowPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [umbrella, setUmbrella] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = () => {
    const found = MOCK_UMBRELLAS[code.toUpperCase()]
    if (found) {
      setUmbrella(found)
      setError('')
    } else {
      setUmbrella(null)
      setError('Umbrella not found. Check the code and try again.')
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Borrow an Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Enter the code printed on the umbrella handle.</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '8px' }}>UMBRELLA CODE</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. NUS-042"
            style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={handleSearch} style={{ padding: '14px 18px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>→</button>
        </div>

        <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
          📍 Not sure where to find one? <span onClick={() => navigate('/map')} style={{ color: '#1a3a33', cursor: 'pointer', fontWeight: '600' }}>View live map ›</span>
        </p>

        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

        {!umbrella && !error && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', opacity: 0.2, marginBottom: '12px' }}>☂️</div>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Enter a valid code to see umbrella details</p>
          </div>
        )}

        {umbrella && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#1a3a33', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>☂️</div>
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{umbrella.code}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{umbrella.name} · <span style={{ color: 'green', fontWeight: '600' }}>Available</span></p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {[{ value: umbrella.studentsHelped, label: 'students helped' }, { value: umbrella.locationsVisited, label: 'locations visited' }, { value: umbrella.daysActive, label: 'days active' }].map(stat => (
                <div key={stat.label} style={{ flex: 1, backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#1a3a33' }}>{stat.value}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#fffbf0', border: '1px solid #e8d9a0', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px' }}>
              ⏱ Return within <strong style={{ color: '#d97706' }}>48 hours</strong> to keep your account in good standing.
            </div>

            <button
              onClick={() => navigate('/borrow/confirm', { state: { umbrella } })}
              style={{ width: '100%', padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Confirm Borrow
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        {[{ icon: '🗺️', label: 'Map' }, { icon: '☂️', label: 'Borrow' }, { icon: '🎁', label: 'Donate' }, { icon: '👤', label: 'Profile' }].map(tab => (
          <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
            if (tab.label === 'Donate') navigate('/donate')
            if (tab.label === 'Profile') navigate('/profile')
            if (tab.label === 'Borrow') navigate('/borrow')
          }}>
            <div style={{ fontSize: '22px' }}>{tab.icon}</div>
            <p style={{ margin: 0, fontSize: '11px', color: tab.label === 'Borrow' ? '#1a3a33' : '#888' }}>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BorrowPage