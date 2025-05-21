"use client"

import { useState } from "react"

interface CreatePartyModalProps {
  show: boolean
  onCreate: (partyName: string) => void
  onClose: () => void
}

const CreatePartyModal = ({ show, onCreate, onClose }: CreatePartyModalProps) => {
  const [newPartyName, setNewPartyName] = useState("")

  if (!show) return null

  const handleCreate = () => {
    if (newPartyName.trim()) {
      onCreate(newPartyName.trim())
      setNewPartyName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Create Party</h3>
        <input
          type="text"
          value={newPartyName}
          onChange={(e) => setNewPartyName(e.target.value)}
          placeholder="Party Name"
          className="w-full px-4 py-3 border border-gray-600 rounded-lg mb-5 text-sm bg-gray-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          autoFocus
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              handleCreate()
              onClose()
            }}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Create
          </button>
          <button
            onClick={() => {
              onClose()
              setNewPartyName("")
            }}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePartyModal
