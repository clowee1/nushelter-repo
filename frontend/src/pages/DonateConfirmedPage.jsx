import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function DonateConfirmedPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [umbrellaId] = useState('NUS-' + Math.floor(Math.random() * 900 + 100))
  const [realCode, setRealCode] = useState(null)

  useEffect(() => {
    const sendDonation = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/donate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            colour: state?.hex || state?.colorName,
            nickname: state?.nickname || state?.colorName,
            condition: state?.condition,
            location_id: state?.location_id 
          })
        })
        const data = await res.json()
        if (res.ok) {
          setRealCode(data.umbrella.umbrella_code)
        }
      } catch (e) {}
    }
    sendDonation()
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: 'white' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: state?.hex || '#1a3a33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '24px auto 16px' }}>☂️</div>

        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 20px', color: '#1a3a33' }}>Your umbrella is registered!</h1>

        <div style={{ backgroundColor: '#1a3a33', borderRadius: '10px', padding: '14px 24px', display: 'inline-block', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '11px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>UMBRELLA ID</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'white', letterSpacing: '2px' }}>{realCode || umbrellaId}</p>
        </div>

        <div style={{ backgroundColor: '#fffbf0', border: '1px solid #e8d9a0', borderRadius: '10px', padding: '16px', textAlign: 'left', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '15px' }}>🏷️ Label your umbrella</p>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
            Before dropping it off, attach a <strong>small waterproof sticker label</strong> to the handle so borrowers can scan and verify it.
          </p>
          <div style={{ backgroundColor: 'white', border: '1px dashed #ccc', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#1a3a33', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>☂️</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '10px', color: '#aaa', letterSpacing: '1px' }}>STICKER READS</p>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', letterSpacing: '1px' }}>{realCode || umbrellaId}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>NUS Umbrella Sharing · scan to borrow</p>
            </div>
          </div>
          {[
            '📦 Request a free label at any campus library counter',
            '✏️ Or write the ID clearly on a waterproof label yourself',
            '📍 Stick it firmly on the handle or canopy spine'
          ].map(tip => <p key={tip} style={{ margin: '4px 0', fontSize: '13px', color: '#555', textAlign: 'left' }}>{tip}</p>)}
        </div>

        <div style={{ backgroundColor: '#f0f5f3', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '20px' }}>
          Drop off at <strong>{state?.locationName}</strong> once labelled. It will go live on the map immediately. 🌂
        </div>

        <button onClick={() => navigate('/profile')} style={{ width: '100%', padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          View My Donated Umbrellas
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default DonateConfirmedPage