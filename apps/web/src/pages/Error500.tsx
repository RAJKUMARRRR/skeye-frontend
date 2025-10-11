import { Link } from 'react-router-dom'

export function Error500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4">
          <span className="text-9xl font-bold text-gray-300">500</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Server Error
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reload Page
          </button>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
