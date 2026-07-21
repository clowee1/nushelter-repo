import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const FAQS = [
  ['How long can I borrow an umbrella?', 'You can borrow an umbrella for up to 48 hours. Please return it to any available NUShelter rack before the deadline.'],
  ['What happens if I return an umbrella late?', 'Your account may be suspended until the umbrella is returned. Return it as soon as possible to restore access.'],
  ['Where can I return an umbrella?', 'Use the Return Umbrella button in your profile to see live rack availability and choose a return station.'],
  ['Why is a rack shown as empty?', 'The live count is updated after a successful borrow or return. If it looks incorrect, refresh the map and try again.'],
  ['How do thank-you notes work?', 'Borrowers can leave an anonymous note after returning an umbrella. The donor sees it on that umbrella’s detail page.']
]

function HelpPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)
  return <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f0f0f0', paddingBottom: '80px' }}>
    <div style={{ backgroundColor: '#1a3a33', padding: '48px 24px 24px', color: 'white' }}>
      <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'block', opacity: .8 }}>‹ Profile</span>
      <h1 style={{ margin: '0 0 4px', fontSize: '24px', color: 'white' }}>Help & FAQ</h1>
      <p style={{ margin: 0, opacity: .7, fontSize: '14px' }}>Answers about borrowing and donating.</p>
    </div>
    <div style={{ padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        {FAQS.map(([question, answer], index) => <button key={question} onClick={() => setOpen(open === index ? null : index)} style={{ width: '100%', padding: '17px 16px', border: 'none', borderBottom: index < FAQS.length - 1 ? '1px solid #eee' : 'none', backgroundColor: 'white', textAlign: 'left', cursor: 'pointer' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px', fontWeight: '700', color: '#222' }}>{question}<span style={{ color: '#1a3a33' }}>{open === index ? '−' : '+'}</span></span>
          {open === index && <span style={{ display: 'block', marginTop: '10px', fontSize: '13px', fontWeight: '400', lineHeight: 1.5, color: '#666' }}>{answer}</span>}
        </button>)}
      </div>
      <div style={{ backgroundColor: '#f0f5f3', borderRadius: '12px', padding: '16px', marginTop: '16px', fontSize: '13px', lineHeight: 1.5, color: '#555' }}><b style={{ color: '#1a3a33' }}>Need more help?</b><br />Contact the NUShelter team through our support channel.</div>
    </div>
    <BottomNav />
  </div>
}

export default HelpPage
