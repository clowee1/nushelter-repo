import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function PrivacyPage() {
  const navigate = useNavigate()
  const [shareLocation, setShareLocation] = useState(() => localStorage.getItem('shareLocation') !== 'false')
  const updateLocation = () => {
    const next = !shareLocation
    setShareLocation(next)
    localStorage.setItem('shareLocation', String(next))
  }

  return <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
    <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
      <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: .8 }}>‹ Profile</span>
      <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: 'white' }}>Privacy</h1>
      <p style={{ margin: 0, opacity: .7, fontSize: '14px' }}>Control how your data is used.</p>
    </div>
    <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px 16px', marginBottom: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}><p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '15px' }}>Share approximate location</p><p style={{ margin: 0, fontSize: '12px', color: '#777', lineHeight: 1.4 }}>Used to centre the map and find nearby umbrella racks. Your location is not shared with donors or borrowers.</p></div>
        <button onClick={updateLocation} aria-pressed={shareLocation} style={{ width: '46px', height: '27px', borderRadius: '20px', border: 'none', backgroundColor: shareLocation ? '#1a3a33' : '#d1d5db', padding: '3px', cursor: 'pointer' }}><span style={{ display: 'block', width: '21px', height: '21px', borderRadius: '50%', backgroundColor: 'white', transform: `translateX(${shareLocation ? '19px' : '0'})`, transition: 'transform .2s' }} /></button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px 16px', fontSize: '13px', color: '#666', lineHeight: 1.55 }}>
        <p style={{ margin: '0 0 10px', fontWeight: '700', color: '#222' }}>How NUShelter protects you</p>
        <p style={{ margin: '0 0 8px' }}>Thank-you notes are anonymous. Donors do not see borrower names or contact details.</p>
        <p style={{ margin: 0 }}>Your account information is used only to operate the umbrella-sharing service.</p>
      </div>
    </div>
    <BottomNav />
  </div>
}

export default PrivacyPage
