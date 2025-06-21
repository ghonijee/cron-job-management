import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

// Temporary placeholder components
function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Cron Jobs Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your scheduled HTTP endpoint calls with ease
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Get Started
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <p className="text-center text-gray-600">Login page coming soon...</p>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Dashboard coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default App
