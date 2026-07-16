import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

/**
 * LoginPage — Owner login + registration form.
 * Route: /login
 */
export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')   // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (mode === 'register' && !form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Must be at least 6 characters'
    if (mode === 'register' && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password)
        if (data.success) {
          toast.success(`Welcome back, ${data.user.name}! 🎉`)
          navigate('/owner/my-pgs')
        }
      } else {
        const data = await register(form.name, form.email, form.password, form.phone)
        if (data.success) {
          toast.success(`Account created! Welcome, ${data.user.name}! 🎉`)
          navigate('/owner/my-pgs')
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputField = (id, label, type, placeholder, key, required = true) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}{required && ' *'}</label>
      <input
        id={id}
        type={type}
        className={`form-input ${errors[key] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => update(key, e.target.value)}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
      />
      {errors[key] && <span className="form-error">{errors[key]}</span>}
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="card p-8 shadow-xl animate-fade-in-up">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-lg mb-3">
              <span className="text-3xl">🏠</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {mode === 'login' ? 'Owner Login' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Sign in to manage your PG listings'
                : 'Join as a PG owner and list your properties'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrors({}) }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? '🔑 Login' : '✨ Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && inputField('reg-name', 'Full Name', 'text', 'John Doe', 'name')}
            {inputField('auth-email', 'Email Address', 'email', 'owner@example.com', 'email')}
            {mode === 'register' && inputField('reg-phone', 'Phone Number', 'tel', '+91 9876543210', 'phone', false)}
            {inputField('auth-password', 'Password', 'password', '••••••••', 'password')}
            {mode === 'register' && inputField('reg-confirm', 'Confirm Password', 'password', '••••••••', 'confirmPassword')}

            <button
              id="auth-submit-btn"
              type="submit"
              className="btn btn-primary w-full btn-lg mt-2"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" />{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              ) : (
                mode === 'login' ? '🔑 Sign In' : '🚀 Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}) }}
              className="text-brand-500 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
