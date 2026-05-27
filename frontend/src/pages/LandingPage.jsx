import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  const handleUserChoice = async (isExistingUser) => {
    const res = await fetch('http://127.0.0.1:5000/api/existing-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isExistingUser })
    })
    const data = await res.json()
    navigate(data.redirectTo)
  }

  return (
    <div style={{
      backgroundColor: '#1a3a33',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 24px 40px',
      fontFamily: 'sans-serif',
      color: 'white'
    }}>
      {/* Top section */}
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        
        {/* Umbrella illustration placeholder */}
        <div style={{ fontSize: '80px', marginBottom: '8px' }}>☂️</div>

        {/* App name */}
        <p style={{ color: '#7ecfb3', letterSpacing: '2px', fontSize: '12px', fontWeight: '600', margin: 0 }}>
          NUS UMBRELLA SHARING
        </p>

        {/* Tagline */}
        <h1 style={{ color: 'white',fontSize: '32px', fontStyle: 'italic', fontWeight: '400', margin: 0, lineHeight: 1.3, textAlign: 'center' }}>
          Stay dry,<br />share the care.
        </h1>

        {/* Description */}
        <p style={{ fontSize: '14px', opacity: 0.8, textAlign: 'center', margin: 0 }}>
          Borrow an umbrella when you need one.<br />Donate yours when you don't.
        </p>

        {/* Location badge */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          📍 National University of Singapore
        </div>
      </div>

      {/* Bottom section */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.7, margin: 0 }}>
          Are you an existing user?
        </p>

        <button
          onClick={() => handleUserChoice(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'white',
            color: '#1a3a33',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
          Yes — Log In
        </button>

        <button
          onClick={() => handleUserChoice(false)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
          No — Create Account
        </button>

        <p style={{ textAlign: 'center', fontSize: '11px', opacity: 0.5, margin: 0 }}>
          By continuing you agree to NUS IT usage policies.
        </p>
      </div>
    </div>
  )
}

export default LandingPage