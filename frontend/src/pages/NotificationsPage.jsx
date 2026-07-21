import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const STORAGE_KEY = 'notificationPreferences'

function Toggle({ checked, onChange, label }) {
  return <button onClick={onChange} aria-label={label} aria-pressed={checked} style={{ width: '46px', height: '27px', borderRadius: '20px', border: 'none', backgroundColor: checked ? '#1a3a33' : '#d1d5db', padding: '3px', cursor: 'pointer', transition: 'background-color .2s' }}>
    <span style={{ display: 'block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: 'white', transform: `translateX(${checked ? '19px' : '0'})`, transition: 'transform .2s' }} />
  </button>
}

function NotificationsPage() {
  const navigate = useNavigate()
  const [preferences, setPreferences] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"reminders":true,"availability":true,"thankYouNotes":true}'))

  const updatePreference = key => {
    const next = { ...preferences, [key]: !preferences[key] }
    setPreferences(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const rows = [
    { key: 'reminders', title: 'Return reminders', detail: 'Reminders at 6, 24, and 36 hours after borrowing.', alignItems: 'left' },
    { key: 'availability', title: 'Station availability', detail: 'Updates when nearby racks have umbrellas available.', alignItems: 'left' },
    { key: 'thankYouNotes', title: 'Thank-you notes', detail: 'Get notified when someone thanks you for an umbrella.', alignItems: 'left' }
  ]

  return <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
    <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
      <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: .8 }}>‹ Profile</span>
      <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: 'white' }}>Notifications</h1>
      <p style={{ margin: 0, opacity: .7, fontSize: '14px' }}>Choose which updates you receive.</p>
    </div>
    <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        {rows.map((row, index) => <div key={row.key} style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: index < rows.length - 1 ? '1px solid #eee' : 'none' }}>
          <div style={{ flex: 1 }}><p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700' }}>{row.title}</p><p style={{ margin: 0, fontSize: '12px', color: '#777', lineHeight: 1.4 }}>{row.detail}</p></div>
          <Toggle checked={preferences[row.key]} onChange={() => updatePreference(row.key)} label={row.title} />
        </div>)}
      </div>
      <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.5, margin: '16px 4px' }}>These preferences are saved on this device. Push notifications need to be enabled by the app and your browser.</p>
    </div>
    <BottomNav />
  </div>
}

export default NotificationsPage
