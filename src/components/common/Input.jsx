import PropTypes from 'prop-types'

export default function Input({ 
  label,
  className = '',
  containerClassName = '',
  ...props 
}) {
  const baseStyle = 'w-full h-full px-4 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 shadow-sm'

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="h-11">
        <input
          className={`${baseStyle} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string
} 