import PropTypes from 'prop-types'

const variants = {
  primary: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
  secondary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
  success: 'bg-green-500 hover:bg-green-600',
  gray: 'bg-gray-500 hover:bg-gray-600'
}

const sizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-8 py-3 text-xl'
}

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) {
  const baseStyle = 'text-white rounded-xl transition-all duration-200 font-medium'
  const variantStyle = variants[variant]
  const sizeStyle = sizes[size]

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
} 