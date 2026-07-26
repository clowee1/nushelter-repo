import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function Toggle({ checked, onChange, label }) {
  return <button 
    onClick={onChange} 
    aria-label={label} 
    aria-pressed={checked} 
    style={{ 
      width: '46px', 
      height: '27px', 
      borderRadius: '20px', 
      border: 'none', 
      backgroundColor: checked ? '#1a3a33' : '#d1d5db', 
      padding: '3px', 
      cursor: 'pointer', 
      transition: 'background-color .2s' 
    }}>
    <span style={{ 
      display: 'block', 
      width: '21px', 
      height: '21px', 
      borderRadius: '50%', 
      backgroundColor: 'white', 
      transform: `translateX(${checked ? '19px' : '0'})`, 
      transition: 'transform .2s' 
    }} />
  </button>
}

function NotificationsPage() {
  const navigate = useNavigate()

  const [preferences, setPreferences] = useState({
    borrow: true,
    return: true,
    thank_you_note: true
  })

  const [loading, setLoading] = useState(true)

  // Load notification preferences from backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:5000/notification-preferences',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setPreferences(data)
        }

      } catch (error) {
        console.log("Failed to load notification preferences", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [])


  // Update backend when toggle changes
  const updatePreference = async key => {

    const next = {
      ...preferences,
      [key]: !preferences[key]
    }

    setPreferences(next)

    try {
      await fetch(
        'http://127.0.0.1:5000/notification-preferences',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(next)
        }
      )

    } catch (error) {
      console.log("Failed to update notification preference", error)
    }
  }


  const rows = [
    { 
      key: 'borrow', 
      title: 'Umbrella borrowed', 
      detail: 'Get notified when someone borrows your umbrella.' 
    },
    { 
      key: 'return', 
      title: 'Umbrella returned', 
      detail: 'Get notified when your umbrella is returned.' 
    },
    { 
      key: 'thank_you_note', 
      title: 'Thank-you notes', 
      detail: 'Get notified when someone thanks you for your umbrella.' 
    }
  ]


  return <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
    
    <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
      <span 
        onClick={() => navigate('/profile')} 
        style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: .8 }}
      >
        ‹ Profile
      </span>

      <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: 'white' }}>
        Notifications
      </h1>

      <p style={{ margin: 0, opacity: .7, fontSize: '14px' }}>
        Choose which updates you receive.
      </p>
    </div>


    <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>

      <div 
        onClick={() => navigate('/notifications/inbox')} 
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '16px 20px', 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer' 
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>
            View all notifications
          </p>

          <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
            See your umbrella activity
          </p>
        </div>

        <span style={{ color: '#ccc' }}>
          ›
        </span>
      </div>


      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>

        {loading ? (

          <p style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#888',
            fontSize: '13px'
          }}>
            Loading preferences...
          </p>

        ) : (

          rows.map((row, index) => (

            <div 
              key={row.key} 
              style={{ 
                padding: '18px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '14px', 
                borderBottom: index < rows.length - 1 ? '1px solid #eee' : 'none' 
              }}
            >

              <div style={{ flex: 1 }}>

                <p style={{ 
                  margin: '0 0 4px', 
                  fontSize: '15px', 
                  fontWeight: '700' 
                }}>
                  {row.title}
                </p>

                <p style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  color: '#777', 
                  lineHeight: 1.4 
                }}>
                  {row.detail}
                </p>

              </div>


              <Toggle 
                checked={preferences[row.key]} 
                onChange={() => updatePreference(row.key)} 
                label={row.title} 
              />

            </div>

          ))

        )}

      </div>


      <p style={{ 
        fontSize: '12px', 
        color: '#888', 
        lineHeight: '1.5', 
        margin: '16px 4px' 
      }}>
        These preferences are saved to your account. Push notifications still require browser and app permissions.
      </p>

    </div>


    <BottomNav />

  </div>
}

export default NotificationsPage