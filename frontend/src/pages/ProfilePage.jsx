import { useNavigate } from 'react-router-dom'

function ProfilePage() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Dark header */}
      <div style={{
        backgroundColor: '#1a3a33',
        padding: '48px 24px 24px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
        }}>👤</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Ashleighlimty</h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>ashleighlimty@gmail.com</p>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
        {/* Donated Umbrellas */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>My Donated Umbrellas</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', backgroundColor: '#1a3a33',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>☂️</div>
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>NUS-042 · Blue Polka Dot</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>47 students helped · 6 locations</p>
              </div>
            </div>
            <span style={{ color: '#ccc' }}>›</span>
          </div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#1a3a33', marginTop: '16px', cursor: 'pointer' }}>+ Donate another umbrella</p>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>My Stats</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[{ value: '12', label: 'Borrowed' }, { value: '1', label: 'Donated' }, { value: '100%', label: 'On time' }].map(stat => (
              <div key={stat.label} style={{
                flex: 1, backgroundColor: '#f8f8f8', borderRadius: '8px',
                padding: '16px', textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#1a3a33' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          {[
            { icon: '🔔', label: 'Notifications' },
            { icon: '🛡️', label: 'Privacy' },
            { icon: '❓', label: 'Help & FAQ' },
          ].map((item, i) => (
            <div key={item.label} style={{
              padding: '16px 20px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', cursor: 'pointer',
              borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '15px' }}>{item.label}</span>
              </div>
              <span style={{ color: '#ccc' }}>›</span>
            </div>
          ))}
          <div
            onClick={() => navigate('/')}
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}>
            <span>🚪</span>
            <span style={{ fontSize: '15px', color: 'red' }}>Sign Out</span>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: 'white', borderTop: '1px solid #eee',
          display: 'flex', justifyContent: 'space-around', padding: '12px 0'
        }}>
          {[{ icon: '🗺️', label: 'Map' }, { icon: '☂️', label: 'Borrow' }, { icon: '🎁', label: 'Donate' }, { icon: '👤', label: 'Profile' }].map(tab => (
            <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: '22px' }}>{tab.icon}</div>
              <p style={{ margin: 0, fontSize: '11px', color: tab.label === 'Profile' ? '#1a3a33' : '#888' }}>{tab.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
