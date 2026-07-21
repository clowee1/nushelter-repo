import { useNavigate, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function BorrowConfirmPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const umbrella = state?.umbrella

  const handleConfirm = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ umbrella_id: umbrella.umbrella_id })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
        return
      }
    } catch (e) {}

    const borrowData = {
      code: umbrella.code,
      name: umbrella.name,
      umbrella_id: umbrella.umbrella_id,
      borrowedAt: new Date().toISOString()
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    localStorage.setItem(`activeBorrow:${user.user_id}`, JSON.stringify(borrowData))
    navigate('/borrow/success', { state: { umbrella } })
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Confirm Borrow</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Review the details before borrowing.</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#1a3a33', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>☂️</div>
            <div>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{umbrella?.code}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{umbrella?.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
            <span style={{ color: '#888' }}>Pick-up location</span>
            <span style={{ fontWeight: '600', color: '#1a3a33' }}>{umbrella?.location}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
            <span style={{ color: '#888' }}>Return deadline</span>
            <span style={{ fontWeight: '600', color: '#d97706' }}>48 hours</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fffbf0', border: '1px solid #e8d9a0', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.5 }}>
          ⚠️ Your account will be <strong>suspended</strong> if the umbrella is not returned within 48 hours. You will receive reminders at 6h, 24h, and 36h.
        </div>

        <button onClick={handleConfirm} style={{ width: '100%', padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Confirm Borrow
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default BorrowConfirmPage
