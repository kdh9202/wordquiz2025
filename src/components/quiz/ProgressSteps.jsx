import PropTypes from 'prop-types'

export default function ProgressSteps({ 
  total,
  current,
  className = ''
}) {
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
              ${index === current
                ? 'border-blue-500 bg-blue-500 text-white'
                : index < current
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-gray-300 bg-white'
              }`}
          >
            {index < current && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
            )}
            {index === current && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          {index < total - 1 && (
            <div className={`w-8 h-0.5 ${
              index < current
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

ProgressSteps.propTypes = {
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  className: PropTypes.string
} 