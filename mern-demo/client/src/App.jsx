import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadStudents = async () => {
    try {
      setError('')
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Khong the tai danh sach sinh vien')
      setStudents(await response.json())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Khong the them sinh vien')
      }
      setForm({ studentId: '', name: '', email: '' })
      await loadStudents()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="dashboard">
      <header className="topbar"><div><span className="mark">CL</span><span>Cloud Lab</span></div><span className="status"><i /> MongoDB Atlas connected</span></header>
      <section className="intro"><p className="eyebrow">Student registry / MERN demo</p><h1>Danh sach sinh vien</h1><p className="subtitle">Theo doi thong tin sinh vien trong cloud_lab.</p></section>
      <section className="content-grid">
        <form className="student-form" onSubmit={handleSubmit}><p className="eyebrow">New record</p><h2>Them sinh vien</h2><label>MSSV<input name="studentId" value={form.studentId} onChange={handleChange} placeholder="VD: SV003" required /></label><label>Ho va ten<input name="name" value={form.name} onChange={handleChange} placeholder="Nguyen Van C" required /></label><label>Email<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="sinhvien@example.com" required /></label><button type="submit" disabled={submitting}>{submitting ? 'Dang luu...' : 'Luu sinh vien'}</button></form>
        <section className="student-list"><div className="list-heading"><div><p className="eyebrow">Records</p><h2>Sinh vien hien co</h2></div><span className="count">{students.length} total</span></div>{error && <p className="error">{error}</p>}{loading ? <p className="empty">Dang tai du lieu...</p> : students.length === 0 ? <p className="empty">Chua co sinh vien nao.</p> : <div className="table-wrap"><table><thead><tr><th>MSSV</th><th>Ho va ten</th><th>Email</th></tr></thead><tbody>{students.map((student) => <tr key={student._id}><td><strong>{student.studentId}</strong></td><td>{student.name}</td><td>{student.email}</td></tr>)}</tbody></table></div>}</section>
      </section>
    </main>
  )
}

export default App
