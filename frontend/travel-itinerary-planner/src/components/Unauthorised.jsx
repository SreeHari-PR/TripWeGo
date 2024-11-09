import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
          <h2 className="text-4xl font-bold text-gray-700">Page Not Found</h2>
          <p className="text-xl text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        </div>
        <div className="mt-8 space-y-4">
          <a href="/" className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </a>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          If you believe this is a mistake, please contact our{' '}
          <a href="/support" className="font-medium text-indigo-600 hover:text-indigo-500">
            support team
          </a>
          .
        </p>
      </div>
    </div>
  )
}