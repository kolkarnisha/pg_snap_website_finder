import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import PGListPage from './pages/PGListPage.jsx'
import PGDetailPage from './pages/PGDetailPage.jsx'
import RegisterPGPage from './pages/RegisterPGPage.jsx'
import MyPGsPage from './pages/MyPGsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

/**
 * Protected route wrapper — redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><span className="spinner text-brand-500 w-10 h-10" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/pgs"       element={<PGListPage />} />
          <Route path="/pg/:id"    element={<PGDetailPage />} />
          <Route path="/login"     element={<LoginPage />} />

          {/* Protected Owner Routes */}
          <Route path="/owner/register-pg" element={
            <ProtectedRoute><RegisterPGPage /></ProtectedRoute>
          }/>
          <Route path="/owner/my-pgs" element={
            <ProtectedRoute><MyPGsPage /></ProtectedRoute>
          }/>
          <Route path="/owner/edit-pg/:id" element={
            <ProtectedRoute><RegisterPGPage /></ProtectedRoute>
          }/>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
