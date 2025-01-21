import PropTypes from 'prop-types'

export default function QuizCard({ 
  char,
  isHidden,
  isRevealed,
  onClick,
  className = '',
  size = 'lg',
  index,
  isAnswerCard = false  // 정답 카드 여부를 구분하기 위한 prop 추가
}) {
  const sizes = {
    lg: 'w-32 h-32 text-5xl',
    md: 'w-24 h-24 text-4xl',
    sm: 'w-16 h-16 text-2xl'
  }

  const baseStyle = `${sizes[size]} flex items-center justify-center font-bold rounded-2xl select-none cursor-default`

  if (!isHidden) {
    return (
      <div className={`${baseStyle} bg-lime-100 ${className}`}>
        {char}
      </div>
    )
  }

  return (
    <div className={`${baseStyle} relative ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {/* 뒷면 (물음표 또는 일련번호) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl select-none
          transition-transform duration-500 [transform-style:preserve-3d] [backface-visibility:hidden]
          ${isRevealed ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {isAnswerCard ? '?' : index + 1}
      </div>
      {/* 앞면 (글자) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center ${isAnswerCard ? 'bg-pink-500' : 'bg-blue-500'} text-white rounded-2xl select-none
          transition-transform duration-500 [backface-visibility:hidden] [transform:rotateY(180deg)]
          ${isRevealed ? '[transform:rotateY(360deg)]' : ''}`}
      >
        {char}
      </div>
    </div>
  )
}

QuizCard.propTypes = {
  char: PropTypes.string.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isRevealed: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  index: PropTypes.number,
  isAnswerCard: PropTypes.bool
} 