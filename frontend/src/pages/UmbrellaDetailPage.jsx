import { useNavigate, useLocation } from 'react-router-dom'

const MOCK_NOTES = [
  { message: 'Caught in the rain between lectures — this literally saved me. Thank you!', location: 'Central Library', time: 'Tue, 2h ago' },
  { message: 'Such a thoughtful initiative. You made my whole day better!', location: 'COM1 Lobby', time: 'Mon, 1d ago' },
]

const MOCK_JOURNEY = [
  { location: 'CLB', date: '3 Jan' },
  { location: 'UTown', date: '11 Jan' },
  { location: 'Science', date: '19 Jan' },
  { location: 'COM2', date: 'now' },
]

function UmbrellaDetailPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const umbrella = state?.umbrella || {
    code: 'NUS-042',
    name: 'Blue Polka Dot',
    studentsHelped: 47,
    daysActive: 89,
    locations: 6,
    donatedDate: '3 Jan 2026',
    donatedLocation: 'CLB Level 1'
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 32px', color: 'white' }}>
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ My Umbrellas</span>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', marginBottom: '12px' }}>
          ☂ {umbrella.code} · {umbrella.name}
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontStyle: 'italic', fontWeight: '700', lineHeight: 1.2 }}>
          sheltered <span style={{ color: '#7ecfb3' }}>{umbrella.studentsHelped} students</span><br />across campus.
        </h1>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.6 }}>donated {umbrella.donatedDate} · {umbrella.donatedLocation}</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[{ value: umbrella.studentsHelped, label: 'students helped' }, { value: umbrella.daysActive, label: 'days active' }, { value: umbrella.locations, label: 'locations' }].map(stat => (
              <div key={stat.label} style={{ flex: 1, backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a3a33' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 16px', fontWeight: '700', fontSize: '13px', letterSpacing: '1px', color: '#888' }}>JOURNEY</p>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '8px', left: '8px', right: '8px', height: '2px', backgroundColor: '#e0e0e0', zIndex: 0 }} />
            {MOCK_JOURNEY.map((stop, i) => (
              <div key={stop.location} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: i < MOCK_JOURNEY.length - 1 ? '#1a3a33' : 'white', border: '2px solid #1a3a33', margin: '0 auto 8px' }} />
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '600' }}>{stop.location}</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#aaa' }}>{stop.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thank you notes */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
          <p style={{ margin: '0 0 16px', fontWeight: '700', fontSize: '13px', letterSpacing: '1px', color: '#888' }}>THANK-YOU NOTES ({MOCK_NOTES.length})</p>
          {MOCK_NOTES.map((note, i) => (
            <div key={i} style={{ backgroundColor: '#1a3a33', borderRadius: '10px', padding: '16px', marginBottom: i < MOCK_NOTES.length - 1 ? '12px' : 0, color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2px 10px', fontSize: '12px' }}>anonymous</span>
                <span style={{ fontSize: '12px', opacity: 0.6 }}>{note.time}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>"{note.message}"</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.6 }}>📍 Returned at {note.location}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        {[{ icon: '🗺️', label: 'Map' }, { icon: '☂️', label: 'Borrow' }, { icon: '🎁', label: 'Donate' }, { icon: '👤', label: 'Profile' }].map(tab => (
          <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
            if (tab.label === 'Donate') navigate('/donate')
            if (tab.label === 'Profile') navigate('/profile')
            if (tab.label === 'Borrow') navigate('/borrow')
          }}>
            <div style={{ fontSize: '22px' }}>{tab.icon}</div>
            <p style={{ margin: 0, fontSize: '11px', color: tab.label === 'Profile' ? '#1a3a33' : '#888' }}>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UmbrellaDetailPage