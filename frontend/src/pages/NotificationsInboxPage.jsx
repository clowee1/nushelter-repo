import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function NotificationsInboxPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
        if (Array.isArray(data)) {
          setNotifications(data)
        } else {
          setNotifications([])
        }
      } catch (e) {
        setError(true)
        setNotifications([])
      }
      setLoading(false)
    }
    fetchNotifications()
  }, [])

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  const getIcon = (type) => {
    if (type === 'overdue') return '🚨'
    if (type === 'due_soon') return '⚠️'
    if (type === 'thank_you') return '💚'
    if (type === 'borrowed') return '☂️'
    if (type === 'returned') return '✅'
    return '🔔'
  }

  const getColor = (type) => {
    if (type === 'overdue') return '#fee2e2'
    if (type === 'due_soon') return '#fffbf0'
    if (type === 'thank_you') return '#f0f5f3'
    return 'white'
  }

  const getBorderColor = (type) => {
    if (type === 'overdue') return '#f87171'
    if (type === 'due_soon') return '#e8d9a0'
    if (type === 'thank_you') return '#1a3a33'
    return '#e0e0e0'
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate('/notifications')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: 'white'}}>Notifications</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Your umbrella activity updates</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        {loading && (
          <p style={{ color: '#aaa', textAlign: 'center', fontSize: '13px' }}>Loading...</p>
        )}

        {!loading && error && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</p>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Could not load notifications. Try again later.</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔔</p>
            <p style={{ color: '#888', fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>No notifications yet</p>
            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>When you borrow, return, or receive a thank-you note, it will appear here.</p>
          </div>
        )}

        {!loading && !error && notifications.map(notif => (
          <div key={notif.notification_id}
            style={{
              backgroundColor: getColor(notif.type),
              border: `1px solid ${getBorderColor(notif.type)}`,
              borderRadius: '12px', padding: '16px',
              marginBottom: '12px'
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{getIcon(notif.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>{notif.title}</p>
                  <span style={{ fontSize: '11px', color: '#888' }}>{formatTime(notif.created_at)}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: 1.5 }}>{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}

export default NotificationsInboxPage