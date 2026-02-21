import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import DetectPage from './pages/DetectPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/detect" element={<ProtectedRoute user={user}><DetectPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
