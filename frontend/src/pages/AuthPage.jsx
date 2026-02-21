import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const payload = isRegister ? form : { email: form.email, password: form.password }
      const { data } = await api.post(endpoint, payload)
      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed')
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-md glass rounded-2xl p-8">
      <h2 className="text-2xl font-semibold">{isRegister ? 'Create account' : 'Welcome back'}</h2>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        {isRegister && <input className="w-full rounded-lg bg-white/10 p-3" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="w-full rounded-lg bg-white/10 p-3" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg bg-white/10 p-3" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button className="w-full rounded-lg bg-cyan-400 p-3 font-semibold text-slate-900">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </main>
  )
}
