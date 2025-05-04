import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_LFG_POST, UPDATE_LFG_POST } from "@/graphql/lfgQueries";
import { useGames } from "@/contexts/GameContext"; // Import GameContext
import { useNavigate } from "react-router-dom";
import { LFGPostFormData } from "./UserLFGPosts";

type LfgFormProps = {
  initialData?: LFGPostFormData & { id: string };
  onClose?: () => void;
};

const defaultValues: LFGPostFormData = {
  gameId: "",
  title: "",
  description: "",
  requirements: [],
  tags: [],
  expirationHour: 24,
};

const LfgForm: React.FC<LfgFormProps> = ({ initialData, onClose }) => {
  const [formData, setFormData] = useState<LFGPostFormData>(
    initialData || defaultValues
  ); // Initialize form data with initialData if editing

  const { games, loading: gamesLoading, error: gamesError } = useGames(); // Use GameContext here

  const [error, setError] = useState("");
  const isEdit = Boolean(initialData);
  const navigate = useNavigate();

  const [createLfgPost, { loading: creating }] = useMutation(
    CREATE_LFG_POST,
    {}
  );

  const [updateLfgPost, { loading: updating }] = useMutation(
    UPDATE_LFG_POST,
    {}
  );

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expirationHour" ? Number(value) : value,
    }));
  };

  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle comma-separated list input
  const handleListChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // console.log(formData.gameId);

    // Check for required fields validation (all except expirationHour)
    if (!formData.gameId || !formData.title || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (isEdit && initialData?.id) {
        const { gameId, ...updateData }: LFGPostFormData = formData;
        await updateLfgPost({
          variables: { postId: initialData.id, ...updateData },
        });
      } else {
        await createLfgPost({ variables: formData });
      }

      if (onClose) onClose();
      else navigate("/lfg"); // fallback navigation
    } catch (err: any) {
      setError("Failed to submit post. Please try again.");
      console.error("Submit error:", err.message);
    }
  };

  if (gamesLoading) return <div>Loading games...</div>;
  if (gamesError) return <div>Error loading games: {gamesError.message}</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700"
    >
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Game
        </label>
        <select
          name="gameId"
          value={formData.gameId}
          onChange={handleSelectChange} // Use the new handleSelectChange function
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a game
          </option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          name="title"
          placeholder="Post title"
          value={formData.title}
          onChange={handleInputChange} // Use handleInputChange for input fields
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Write a description..."
          value={formData.description}
          onChange={handleInputChange} // Use handleInputChange for textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Requirements
        </label>
        <input
          name="requirements"
          placeholder="Comma-separated list (e.g. mic, rank X)"
          value={(formData.requirements || []).join(", ")} // Fallback to empty array if undefined
          onChange={(e) => handleListChange("requirements", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Tags
        </label>
        <input
          name="tags"
          placeholder="Comma-separated tags (e.g. casual, competitive)"
          value={formData.tags.join(", ")}
          onChange={(e) => handleListChange("tags", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          Expiration (in hours)
        </label>
        <input
          type="number"
          name="expirationHour"
          placeholder="24"
          value={formData.expirationHour}
          onChange={handleInputChange} // Use handleInputChange for number inputs
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="submit"
          disabled={creating || updating}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {isEdit ? "Update" : "Create"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-md transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default LfgForm;
