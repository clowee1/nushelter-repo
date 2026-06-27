import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function DonateReviewPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: 'white' }}>Donate an Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Help keep NUS dry, one umbrella at a time.</p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: n <= 4 ? 'white' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>Review your donation</h2>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: state?.hex || '#1a3a33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>☂️</div>
            <div>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>{state?.nickname || `${state?.colorName} Umbrella`}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{state?.colorName} · {state?.hex?.toUpperCase()} · ID assigned on submit</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
            <span style={{ color: '#888' }}>Condition</span>
            <span style={{ fontWeight: '600', color: '#1a3a33' }}>{state?.condition}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
            <span style={{ color: '#888' }}>Drop-off location</span>
            <span style={{ fontWeight: '600', color: '#1a3a33' }}>{state?.locationName}</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f0f5f3', borderRadius: '8px', padding: '14px', fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '16px' }}>
          Your umbrella will appear on the live map once added to the rack. Borrowers will see its ID, journey, and your stats as it travels campus.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '16px', backgroundColor: 'white', color: '#1a3a33', border: '1.5px solid #1a3a33', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
          <button onClick={() => navigate('/donate/confirmed', { state })} style={{ flex: 1, padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Donate Umbrella</button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default DonateReviewPage