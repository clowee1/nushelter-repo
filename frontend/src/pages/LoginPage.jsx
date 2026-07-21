import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleLogin = async () => {
    console.log('login clicked')
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      console.log('response:', data)
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/profile')

      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Could not connect to server.')
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Dark header */}
      <div style={{
        backgroundColor: '#1a3a33',
        padding: '48px 24px 40px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        color: 'white'
      }}>
        <p onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', opacity: 0.8 }}>‹ Back</p>
        <h1 style={{ color: 'white', margin: '0 0 8px', fontSize: '28px', fontWeight: '700' }}>Welcome back</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Log in to your NUS account</p>
      </div>

      {/* Form */}
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '8px' }}>NUS EMAIL</label>
          <input
            type="email"
            placeholder="e.g. alex.tan@u.nus.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '15px', boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd',
                fontSize: '15px', boxSizing: 'border-box', outline: 'none'
              }}
            />
            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px' }}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <p onClick={() => {}} style={{ textAlign: 'right', fontSize: '13px', color: '#1a3a33', cursor: 'pointer', marginTop: '8px' }}>Forgot password?</p>
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '16px', backgroundColor: '#1a3a33', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>
          Log In
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#1a3a33', fontWeight: '700', cursor: 'pointer' }}>Sign up</span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
