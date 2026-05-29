import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

function getColorName(h, s, l) {
  if (l < 15) return 'Black'
  if (l > 88) return 'White'
  if (s < 12) return l < 40 ? 'Dark Gray' : l < 65 ? 'Gray' : 'Light Gray'
  const names = [
    [0,'Red'],[20,'Orange-Red'],[30,'Orange'],[45,'Amber'],[55,'Yellow'],
    [75,'Yellow-Green'],[100,'Lime'],[140,'Green'],[165,'Teal'],[185,'Cyan'],
    [200,'Sky Blue'],[220,'Blue'],[250,'Indigo'],[270,'Violet'],[290,'Purple'],
    [310,'Magenta'],[330,'Pink'],[350,'Rose'],[360,'Red']
  ]
  const prefix = l < 30 ? 'Dark ' : l > 70 ? 'Light ' : s > 75 ? 'Vivid ' : ''
  for (let i = 0; i < names.length - 1; i++) {
    if (h >= names[i][0] && h < names[i+1][0]) return prefix + names[i][1]
  }
  return prefix + 'Red'
}

function DonatePage() {
  const navigate = useNavigate()
  const [hue, setHue] = useState(210)
  const [saturation, setSaturation] = useState(60)
  const [lightness, setLightness] = useState(45)
  const [nickname, setNickname] = useState('')
  const dragging = useRef(false)
  const wheelRef = useRef(null)

  const hex = hslToHex(hue, saturation, lightness)
  const colorName = getColorName(hue, saturation, lightness)

  const getHandlePos = useCallback(() => {
    const r = 105
    const rad = ((hue - 90) * Math.PI) / 180
    return { x: 130 + r * Math.cos(rad), y: 130 + r * Math.sin(rad) }
  }, [hue])

  const handleWheelInteraction = useCallback((clientX, clientY) => {
    const canvas = wheelRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let angle = Math.atan2(clientY - cy, clientX - cx)
    let h = Math.round((angle * 180) / Math.PI + 90)
    if (h < 0) h += 360
    if (h >= 360) h -= 360
    setHue(h)
  }, [])

  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return
      const touch = e.touches ? e.touches[0] : e
      handleWheelInteraction(touch.clientX, touch.clientY)
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [handleWheelInteraction])

  const handlePos = getHandlePos()

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: 0.8 }}>‹ Back</span>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '700' }}>Donate an Umbrella</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Help keep NUS dry, one umbrella at a time.</p>
        <div style={{ display: 'flex', gap: '4px', marginTop: '20px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', backgroundColor: n === 1 ? 'white' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '4px' }}>Personalise your umbrella</h2>
        <p style={{ fontSize: '13px', color: '#888', marginTop: 0, marginBottom: '16px' }}>Give it a nickname and colour so borrowers know it's yours.</p>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '8px' }}>NICKNAME (OPTIONAL)</label>
          <input
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
            placeholder="e.g. Red Polka Dot, Lucky Blue…"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '8px' }}>UMBRELLA COLOUR</label>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <div
              style={{ position: 'relative', width: '260px', height: '260px', cursor: 'crosshair' }}
              onMouseDown={e => { dragging.current = true; handleWheelInteraction(e.clientX, e.clientY) }}
              onTouchStart={e => { dragging.current = true; handleWheelInteraction(e.touches[0].clientX, e.touches[0].clientY) }}
            >
              <svg ref={wheelRef} width="260" height="260">
                {Array.from({ length: 360 }, (_, i) => {
                  const a1 = ((i - 90) * Math.PI) / 180
                  const a2 = ((i - 89) * Math.PI) / 180
                  const r = 125
                  const x1 = 130 + r * Math.cos(a1), y1 = 130 + r * Math.sin(a1)
                  const x2 = 130 + r * Math.cos(a2), y2 = 130 + r * Math.sin(a2)
                  return <path key={i} d={`M130,130 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={`hsl(${i},${saturation}%,${lightness}%)`} />
                })}
                <circle cx="130" cy="130" r="78" fill={hex} />
                <text x="130" y="142" textAnchor="middle" fontSize="48" fill="rgba(0,0,0,0.25)">☂</text>
                <circle cx={handlePos.x} cy={handlePos.y} r="11" fill="white" stroke={hex} strokeWidth="3" />
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '6px' }}>SATURATION</span>
            <input type="range" min="0" max="100" value={saturation} onChange={e => setSaturation(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1a3a33' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#555', display: 'block', marginBottom: '6px' }}>BRIGHTNESS</span>
            <input type="range" min="5" max="95" value={lightness} onChange={e => setLightness(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#1a3a33' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: hex, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>{colorName}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{hex.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/donate/condition', { state: { nickname, hex, colorName } })}
          style={{ width: '100%', padding: '16px', backgroundColor: '#1a3a33', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Next
        </button>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
        {[{icon:'🗺️',label:'Map'},{icon:'☂️',label:'Borrow'},{icon:'🎁',label:'Donate'},{icon:'👤',label:'Profile'}].map(tab => (
          <div key={tab.label} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => tab.label === 'Profile' && navigate('/profile')}>
            <div style={{ fontSize: '22px' }}>{tab.icon}</div>
            <p style={{ margin: 0, fontSize: '11px', color: tab.label === 'Donate' ? '#1a3a33' : '#888' }}>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonatePage