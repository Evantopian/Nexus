"use client"

interface DeletePartyModalProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
  message?: string
}

const DeletePartyModal = ({
  show,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeletePartyModalProps) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-700">
        <p className="text-white mb-6 text-center font-medium">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletePartyModal
