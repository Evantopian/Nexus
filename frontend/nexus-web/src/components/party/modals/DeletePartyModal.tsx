interface DeletePartyModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const DeletePartyModal = ({
  show,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeletePartyModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-gray-900 dark:text-white mb-4 text-center">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePartyModal;
