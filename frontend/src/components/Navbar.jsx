import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 glass mx-4 mt-4 rounded-2xl px-5 py-3">
      <nav className="flex items-center justify-between">
        <Link className="flex items-center gap-2 font-semibold" to="/">
          <ShieldCheck className="text-cyan-300" /> DeepGuard AI
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/detect">Detect</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="rounded-full bg-cyan-400 px-3 py-1 text-slate-900">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
