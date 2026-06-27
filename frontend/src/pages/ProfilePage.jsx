import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import { Bell, Shield, HelpCircle, LogOut } from 'lucide-react'

function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeBorrow, setActiveBorrow] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [timerColor, setTimerColor] = useState('#1a3a33')
  const [timerPercent, setTimerPercent] = useState(100)
  const [profileData, setProfileData] = useState(null)
  const [donatedUmbrellas, setDonatedUmbrellas] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }

    const fetchAll = async () => {

      try {
        const res = await fetch('http://127.0.0.1:5000/profile', { headers })
        const data = await res.json()
        setProfileData(data)
      } catch (e) {}

      try {
        const res = await fetch('http://127.0.0.1:5000/umbrellas')
        const data = await res.json()
        const mine = data.filter(u => u.owner_id === user.user_id)
        setDonatedUmbrellas(mine)
      } catch (e) {}

      try {
        const res = await fetch('http://127.0.0.1:5000/my_borrows', { headers })
        const data = await res.json()
        const active = data.find(b => b.status === 'Active')
        if (active) {
          const stored = JSON.parse(localStorage.getItem('activeBorrow') || 'null')
          setActiveBorrow({
            code: stored?.code || `NUS-${active.umbrella_id}`,
            name: stored?.name || 'Umbrella',
            umbrella_id: active.umbrella_id,
            borrowedAt: active.borrowed_at,
            location: stored?.location || ''
          })
        } else {
          setActiveBorrow(null)
          localStorage.removeItem('activeBorrow')
        }
      } catch (e) {
        const borrow = JSON.parse(localStorage.getItem('activeBorrow') || 'null')
        if (borrow) setActiveBorrow(borrow)
      }
    }

    fetchAll()
  }, [location])

  useEffect(() => {
    if (!activeBorrow) return
    const interval = setInterval(() => {
      const borrowedAt = new Date(activeBorrow.borrowedAt)
      const deadline = new Date(borrowedAt.getTime() + 48 * 60 * 60 * 1000)
      const now = new Date()
      const diff = deadline - now
      const totalMs = 48 * 60 * 60 * 1000
      const percent = Math.max(0, (diff / totalMs) * 100)
      setTimerPercent(percent)
      if (diff <= 0) {
        setTimeLeft('Overdue!')
        setTimerColor('red')
        clearInterval(interval)
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${hours}h ${minutes}m remaining`)
      if (percent > 50) setTimerColor('#1a3a33')
      else if (percent > 25) setTimerColor('#d97706')
      else setTimerColor('red')
    }, 1000)
    return () => clearInterval(interval)
  }, [activeBorrow])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('activeBorrow')
    navigate('/')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'white'}}>{user.name || 'Guest'}</h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>{user.email || ''}</p>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '100px' }}>

        {activeBorrow && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', border: `1.5px solid ${timerColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '16px' }}>⏱</span>
              <span style={{ fontWeight: '700', fontSize: '15px', color: timerColor }}>{timeLeft}</span>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', height: '6px', marginBottom: '16px' }}>
              <div style={{ width: `${timerPercent}%`, height: '100%', backgroundColor: timerColor, borderRadius: '4px', transition: 'width 1s linear' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#1a3a33', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>☂️</div>
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{activeBorrow.code}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{activeBorrow.name} · {activeBorrow.location}</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#666' }}>
              📅 Scheduled reminders
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>⚠️ 6h after borrow</span>
                <span>⚠️ 24h after borrow</span>
                <span>⚠️ 36h after borrow</span>
              </div>
            </div>
            <button onClick={() => navigate('/return')} style={{ width: '100%', padding: '14px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Return Umbrella
            </button>
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>My Donated Umbrellas</h3>
          {donatedUmbrellas.length === 0 && (
            <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', margin: '0 0 12px' }}>No donated umbrellas yet.</p>
          )}
          {donatedUmbrellas.map(umbrella => (
            <div key={umbrella.umbrella_id}
              onClick={() => navigate('/umbrella', { state: { umbrella: {
                code: umbrella.umbrella_code,
                name: umbrella.nickname,
                colour: umbrella.colour,
                studentsHelped: 0,
                daysActive: 0,
                locations: 0,
                donatedDate: '',
                donatedLocation: ''
              }}})}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: umbrella.colour || '#1a3a33', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>☂️</div>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{umbrella.umbrella_code} · {umbrella.nickname}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: umbrella.status === 'Available' ? 'green' : '#d97706' }}>{umbrella.status}</p>
                </div>
              </div>
              <span style={{ color: '#ccc' }}>›</span>
            </div>
          ))}
          <p onClick={() => navigate('/donate')} style={{ textAlign: 'center', fontSize: '13px', color: '#1a3a33', marginTop: '8px', cursor: 'pointer' }}>+ Donate another umbrella</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>My Stats</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { value: profileData?.stats?.borrowed ?? '0', label: 'Borrowed' },
              { value: profileData?.stats?.donated ?? '0', label: 'Donated' },
              { value: '100%', label: 'On time' }
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#1a3a33' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          {[{ icon: <Bell size={18} color="#555" />, label: 'Notifications' }, { icon: <Shield size={18} color="#555" />, label: 'Privacy' }, { icon: <HelpCircle size={18} color="#555" />, label: 'Help & FAQ' }].map((item, i) => (
            <div key={item.label} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '15px' }}>{item.label}</span>
              </div>
              <span style={{ color: '#ccc' }}>›</span>
            </div>
          ))}
          <div onClick={handleSignOut} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}>
            <LogOut size={18} color="red" />
            <span style={{ fontSize: '15px', color: 'red' }}>Sign Out</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default ProfilePage