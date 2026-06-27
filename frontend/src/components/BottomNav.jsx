import { useNavigate, useLocation } from 'react-router-dom'
import { Map, Umbrella, Gift, User } from 'lucide-react'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Umbrella, label: 'Borrow', path: '/borrow' },
    { icon: Gift, label: 'Donate', path: '/donate' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: 'white', borderTop: '1px solid #eee',
      display: 'flex', justifyContent: 'space-around', padding: '12px 0'
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        const IconComponent = tab.icon
        return (
          <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(tab.path)}>
            <IconComponent size={22} color={active ? '#1a3a33' : '#888'} />
            <p style={{ margin: 0, fontSize: '11px', color: active ? '#1a3a33' : '#888' }}>{tab.label}</p>
          </div>
        )
      })}
    </div>
  )
}

export default BottomNav