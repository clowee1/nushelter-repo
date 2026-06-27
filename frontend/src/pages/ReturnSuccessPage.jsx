import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function ReturnSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingBottom: '80px' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: '#f0f5f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '20px' }}>✓</div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px', textAlign: 'center' }}>Returned!</h1>
      <p style={{ color: '#888', fontSize: '15px', margin: '0 0 8px' }}>Dropped off at {state?.location?.name}</p>
      <p style={{ color: '#888', fontSize: '13px', margin: '0 0 32px' }}>Thank you for returning on time! 🌂</p>

      <button onClick={() => navigate('/profile')} style={{ width: '100%', maxWidth: '400px', padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
        Back to Profile
      </button>

      <BottomNav />
    </div>
  )
}

export default ReturnSuccessPage