import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import DonatePage from './pages/DonatePage'
import DonateConditionPage from './pages/DonateConditionPage'
import DonateLocationPage from './pages/DonateLocationPage'
import DonateReviewPage from './pages/DonateReviewPage'
import DonateConfirmedPage from './pages/DonateConfirmedPage'
import BorrowPage from './pages/BorrowPage'
import BorrowConfirmPage from './pages/BorrowConfirmPage'
import BorrowSuccessPage from './pages/BorrowSuccessPage'
import ReturnLocationPage from './pages/ReturnLocationPage'
import ReturnNotePage from './pages/ReturnNotePage'
import ReturnSuccessPage from './pages/ReturnSuccessPage'
import UmbrellaDetailPage from './pages/UmbrellaDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/donate/condition" element={<DonateConditionPage />} />
        <Route path="/donate/location" element={<DonateLocationPage />} />
        <Route path="/donate/review" element={<DonateReviewPage />} />
        <Route path="/donate/confirmed" element={<DonateConfirmedPage />} />
        <Route path="/borrow" element={<BorrowPage />} />
        <Route path="/borrow/confirm" element={<BorrowConfirmPage />} />
        <Route path="/borrow/success" element={<BorrowSuccessPage />} />
        <Route path="/return" element={<ReturnLocationPage />} />
        <Route path="/return/note" element={<ReturnNotePage />} />
        <Route path="/return/success" element={<ReturnSuccessPage />} />
        <Route path="/umbrella" element={<UmbrellaDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App