import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 text-center">
        <h1 className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-5xl font-bold text-transparent">
          DeepGuard AI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Production-ready deepfake image and video detector powered by PyTorch and Flask.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/detect" className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-900">Start Detection</Link>
          <Link to="/dashboard" className="rounded-full border border-white/20 px-6 py-3">View Dashboard</Link>
        </div>
      </motion.div>
    </main>
  )
}
