import { useState } from "react";

interface CreatePartyModalProps {
  show: boolean;
  onCreate: (partyName: string) => void;
  onClose: () => void;
}

const CreatePartyModal = ({
  show,
  onCreate,
  onClose,
}: CreatePartyModalProps) => {
  const [newPartyName, setNewPartyName] = useState("");

  if (!show) return null;

  const handleCreate = () => {
    if (newPartyName.trim()) {
      onCreate(newPartyName.trim());
      setNewPartyName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
          Create Party
        </h3>
        <input
          type="text"
          value={newPartyName}
          onChange={(e) => setNewPartyName(e.target.value)}
          placeholder="Party Name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 text-sm dark:bg-gray-700 dark:text-white"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              handleCreate();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Create
          </button>
          <button
            onClick={() => {
              onClose();
              setNewPartyName("");
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePartyModal;
