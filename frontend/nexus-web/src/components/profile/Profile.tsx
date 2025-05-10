import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UPDATE_USER, UPDATE_PREFERENCE } from "@/graphql/userQueries";
import { useMutation } from "@apollo/client";
import Dropdown from "./Dropdown";

export type Playstyle = "COMPETITIVE" | "CASUAL";
export type Platform = "PC" | "CONSOLE" | "MOBILE";
export type GameGenre =
  | "RPG"
  | "FPS"
  | "MOBA"
  | "STRATEGY"
  | "ACTION"
  | "ADVENTURE"
  | "SIMULATION";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [updateUser] = useMutation(UPDATE_USER);
  const [updatePreference] = useMutation(UPDATE_PREFERENCE);
  const [editMode, setEditMode] = useState(false);
  const [profileMessage, setProfileMessage] = useState(
    user?.profileMessage || ""
  );
  const [rank, setRank] = useState(user?.rank || "Bronze");
  const [region, setRegion] = useState(user?.preferences?.region || "NA");
  const [playstyle, setPlaystyle] = useState<Playstyle>(
    (user?.preferences?.playstyle as Playstyle) || "CASUAL"
  );
  const [favoritePlatform, setFavoritePlatform] = useState<Platform>(
    (user?.preferences?.favoritePlatform as Platform) || "PC"
  );
  const [favoriteGameGenre, setFavoriteGameGenre] = useState<GameGenre>(
    (user?.preferences?.favoriteGameGenre as GameGenre) || "RPG"
  );

  useEffect(() => {
    if (user) {
      setProfileMessage(user.profileMessage || "");
      setRank(user.rank || "Bronze");
      setRegion(user.preferences?.region || "NA");
      setPlaystyle((user.preferences?.playstyle as Playstyle) || "CASUAL");
      setFavoritePlatform(
        (user.preferences?.favoritePlatform as Platform) || "PC"
      );
      setFavoriteGameGenre(
        (user.preferences?.favoriteGameGenre as GameGenre) || "RPG"
      );
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const handleSave = async () => {
    try {
      await updateUser({
        variables: {
          profileMessage,
          rank,
        },
      });

      await updatePreference({
        variables: {
          region,
          playstyle,
          favoritePlatform,
          favoriteGameGenre,
        },
      });

      await refreshUser();
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleCancel = () => {
    setProfileMessage(user.profileMessage || "");
    setRank(user.rank || "Bronze");
    setRegion(user.preferences?.region || "NA");
    setPlaystyle((user.preferences?.playstyle as Playstyle) || "CASUAL");
    setFavoritePlatform(
      (user.preferences?.favoritePlatform as Platform) || "PC"
    );
    setFavoriteGameGenre(
      (user.preferences?.favoriteGameGenre as GameGenre) || "RPG"
    );
    setEditMode(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={user.profileImg || "/default-avatar.png"}
          alt={user.username}
          className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-600 mb-6"
        />
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            {user.username}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
            @{user.username}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Status: {user.status || "offline"}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-8">
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Bio
          </h3>
          {!editMode && (
            <button
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <div className="flex justify-center w-full">
            <textarea
              value={profileMessage}
              onChange={(e) => setProfileMessage(e.target.value)}
              rows={6} // Increase the rows for a taller textarea
              className="mt-2 w-full max-w-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded p-3"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            {user.profileMessage || "No bio available"}
          </p>
        )}

        {/* Save/Cancel Buttons */}
        {editMode && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* User Info Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Reputation</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.reputation}
          </p>
        </div>

        {/* Dropdowns */}
        <Dropdown
          label="Rank"
          value={rank}
          options={[
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Diamond",
            "Master",
            "Grandmaster",
          ]}
          onChange={setRank}
          isEditMode={editMode}
        />

        <Dropdown
          label="Region"
          value={region}
          options={["NA", "EU", "ASIA", "SA", "OCE"]}
          onChange={setRegion}
          isEditMode={editMode}
        />

        <Dropdown
          label="Playstyle"
          value={playstyle}
          options={["CASUAL", "COMPETITIVE"]}
          onChange={setPlaystyle}
          isEditMode={editMode}
        />

        <Dropdown
          label="Favorite Platform"
          value={favoritePlatform}
          options={["PC", "CONSOLE", "MOBILE"]}
          onChange={setFavoritePlatform}
          isEditMode={editMode}
        />

        <Dropdown
          label="Favorite Game Genre"
          value={favoriteGameGenre}
          options={[
            "RPG",
            "FPS",
            "MOBA",
            "STRATEGY",
            "ACTION",
            "ADVENTURE",
            "SIMULATION",
          ]}
          onChange={setFavoriteGameGenre}
          isEditMode={editMode}
        />

        <div className="text-center col-span-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
            }).format(new Date(user.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
