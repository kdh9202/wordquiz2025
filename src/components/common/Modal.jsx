import PropTypes from 'prop-types'
import Button from './Button'

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
  showCancel = false,
  onConfirm = onClose,
  cancelText = '취소'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[90vw]">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          {showCancel && (
            <Button
              onClick={onClose}
              variant="gray"
              size="sm"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            variant="primary"
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  showCancel: PropTypes.bool,
  onConfirm: PropTypes.func,
  cancelText: PropTypes.string
} 