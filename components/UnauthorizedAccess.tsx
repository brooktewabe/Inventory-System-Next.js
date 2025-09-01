import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function UnauthorizedAccess() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 text-center">
      <div className="max-w-md w-full">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          Sorry, you do not have the necessary permissions to view this page.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-5 py-2 rounded-md text-sm sm:text-base hover:bg-gray-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}