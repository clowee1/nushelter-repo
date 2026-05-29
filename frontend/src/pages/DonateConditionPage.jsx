import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const CONDITIONS = ['Like new', 'Good', 'Fair — minor wear']

function DonateConditionPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [condition, setCondition] = useState('')

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Donate an Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Help keep NUS dry, one umbrella at a time.</p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: n <= 2 ? 'white' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>What condition is it in?</h2>

        {CONDITIONS.map(c => (
          <div key={c} onClick={() => setCondition(c)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer', border: `1.5px solid ${condition === c ? '#1a3a33' : '#e0e0e0'}`, backgroundColor: condition === c ? '#f0f5f3' : 'white', marginBottom: '10px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${condition === c ? '#1a3a33' : '#ccc'}`, backgroundColor: condition === c ? '#1a3a33' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {condition === c && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
            </div>
            <span style={{ fontSize: '15px' }}>{c}</span>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
          <button
            onClick={() => condition && navigate('/donate/location', { state: { ...state, condition } })}
            style={{ flex: 1, padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: condition ? 1 : 0.4 }}>
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

export default DonateConditionPage
