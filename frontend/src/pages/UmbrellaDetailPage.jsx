import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'

const MOCK_JOURNEY = [
  { location: 'CLB', date: '3 Jan' },
  { location: 'UTown', date: '11 Jan' },
  { location: 'Science', date: '19 Jan' },
  { location: 'COM2', date: 'now' },
]

function UmbrellaDetailPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [notes, setNotes] = useState([])
  const umbrella = state?.umbrella || {
    code: 'NUS-042',
    name: 'Blue Polka Dot',
    studentsHelped: 47,
    daysActive: 89,
    locations: 6,
    donatedDate: '3 Jan 2026',
    donatedLocation: 'CLB Level 1'
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/my_notes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.json()
        setNotes(data)
      } catch (e) {}
    }
    fetchNotes()
  }, [])

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 32px', color: 'white' }}>
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ My Umbrellas</span>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', marginBottom: '12px' }}>
          ☂ {umbrella.code} · {umbrella.name}
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontStyle: 'italic', fontWeight: '700', lineHeight: 1.2, color: 'white' }}>
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
          <p style={{ margin: '0 0 16px', fontWeight: '700', fontSize: '13px', letterSpacing: '1px', color: '#888' }}>
            THANK-YOU NOTES ({notes.length})
          </p>
          {notes.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center' }}>No thank-you notes yet.</p>
          )}
          {notes.map((note, i) => (
            <div key={note.note_id || i} style={{ backgroundColor: '#1a3a33', borderRadius: '10px', padding: '16px', marginBottom: i < notes.length - 1 ? '12px' : 0, color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2px 10px', fontSize: '12px' }}>anonymous</span>
                <span style={{ fontSize: '12px', opacity: 0.6 }}>{formatTime(note.created_at)}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>"{note.message}"</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default UmbrellaDetailPage