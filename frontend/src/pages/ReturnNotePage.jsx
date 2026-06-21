import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function ReturnNotePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [note, setNote] = useState('')
  const activeBorrow = JSON.parse(localStorage.getItem('activeBorrow') || 'null')
  const location = state?.location

  const handleReturn = () => {
    localStorage.removeItem('activeBorrow')
    navigate('/return/success', { state: { location, note } })
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Leave a Thank-You Note</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Optional — the donor will see this anonymously.</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        {/* Umbrella summary */}
        <div style={{ backgroundColor: '#1a3a33', borderRadius: '12px', padding: '16px', marginBottom: '20px', color: 'white' }}>
          <p style={{ margin: '0 0 4px', fontSize: '12px', opacity: 0.7 }}>You borrowed</p>
          <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '16px' }}>{activeBorrow?.code} · {activeBorrow?.name}</p>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>Returning to: {location?.name}</p>
        </div>

        <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Your message to the donor ☂️</p>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>A small note of thanks goes a long way. The donor won't see your name.</p>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. You kept me dry on the way to my exam — thank you so much!"
          style={{ width: '100%', height: '120px', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif', marginBottom: '20px' }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleReturn} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Skip
          </button>
          <button onClick={handleReturn} style={{ flex: 2, padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Return Umbrella
          </button>
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
            <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReturnNotePage