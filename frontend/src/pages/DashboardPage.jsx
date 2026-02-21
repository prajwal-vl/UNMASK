import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import api from '../api/client'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0, fakeRate: 0 })

  useEffect(() => {
    api.get('/history').then(({ data }) => {
      setHistory(data.history)
      setStats(data.stats)
    })
  }, [])

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
      <section className="glass rounded-2xl p-6 md:col-span-1">
        <h3 className="mb-4 text-xl font-semibold">Detection Overview</h3>
        <Doughnut data={{ labels: ['Fake', 'Real'], datasets: [{ data: [stats.fake, stats.real], backgroundColor: ['#fb7185', '#22d3ee'] }] }} />
        <p className="mt-4 text-sm">Fake rate: {stats.fakeRate}%</p>
      </section>

      <section className="glass rounded-2xl p-6 md:col-span-2">
        <h3 className="mb-4 text-xl font-semibold">Recent Detections</h3>
        <div className="space-y-3">
          {history.map((item, idx) => (
            <article key={`${item.fileName}-${idx}`} className="rounded-lg bg-white/5 p-3">
              <p className="font-medium">{item.fileName} • {item.fileType}</p>
              <p className="text-sm text-slate-300">{item.result} ({Math.round(item.confidence * 100)}%)</p>
            </article>
          ))}
          {!history.length && <p className="text-sm text-slate-300">No detections yet.</p>}
        </div>
      </section>
    </main>
  )
}
