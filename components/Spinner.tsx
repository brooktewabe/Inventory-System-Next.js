import { FaSpinner } from 'react-icons/fa'

interface SpinnerProps {
  loading?: boolean
  size?: number
}

export default function Spinner({ loading = true, size = 150 }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-blue-600 mb-4" size={size / 3} />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}