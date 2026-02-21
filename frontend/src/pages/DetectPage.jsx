import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../api/client'

export default function DetectPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [isImage, setIsImage] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    const selected = accepted[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setIsImage(selected.type.startsWith('image/'))
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const runDetection = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)
    try {
      const { data } = await api.post('/predict', formData)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  const confidencePercent = result ? Math.round(result.confidence * 100) : 0

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <section {...getRootProps()} className={`glass rounded-2xl border-2 border-dashed p-12 text-center ${isDragActive ? 'border-cyan-300' : 'border-white/20'}`}>
        <input {...getInputProps()} />
        <p>Drag & drop image/video here, or click to upload.</p>
      </section>

      {preview && (isImage ? <img className="max-h-72 w-full rounded-xl object-contain" src={preview} alt="preview" /> : <video className="max-h-72 w-full rounded-xl object-contain" src={preview} controls />)}

      <button onClick={runDetection} disabled={!file || loading} className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-900 disabled:opacity-50">
        {loading ? 'Detecting...' : 'Run AI Detection'}
      </button>

      {result && (
        <section className="glass rounded-2xl p-6">
          <h3 className="text-2xl font-semibold">Result: {result.result}</h3>
          <p className="mt-2">Confidence: {confidencePercent}%</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all" style={{ width: `${confidencePercent}%` }} />
          </div>
        </section>
      )}
    </main>
  )
}
