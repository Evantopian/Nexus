import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../assets/cinnamoroll.jpg";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER, UPDATE_PREFERENCE } from "../../graphql/user/userMutations";
import { PROFILE_QUERY } from "../../graphql/user/userQueries";
import { Picker } from "@react-native-picker/picker";

const RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
const REGIONS = ["NA", "EU", "ASIA", "SA", "OCE"];
const PLAYSTYLES = ["CASUAL", "COMPETITIVE"];
const PLATFORMS = ["PC", "CONSOLE", "MOBILE"];
const GENRES = ["RPG", "FPS", "MOBA", "STRATEGY", "ACTION", "ADVENTURE", "SIMULATION"];

export default function ProfileSettings({ topPadding }) {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileImg, setProfileImg] = useState(user?.profileImg || "");
  const [username, setUsername] = useState(user?.username || "");
  const [profileMessage, setProfileMessage] = useState(user?.profileMessage || "");
  const [rank, setRank] = useState(user?.rank || "Bronze");
  const [age, setAge] = useState(user?.age ? String(user.age) : "");
  const [playstyle, setPlaystyle] = useState(user?.preferences?.playstyle || "CASUAL");
  const [region, setRegion] = useState(user?.preferences?.region || "NA");
  const [favoritePlatform, setFavoritePlatform] = useState(user?.preferences?.favoritePlatform || "PC");
  const [favoriteGameGenre, setFavoriteGameGenre] = useState(user?.preferences?.favoriteGameGenre || "RPG");

  const { data: userData, refetch: apolloRefetch } = useQuery(PROFILE_QUERY);

  const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: PROFILE_QUERY }],
  });
  const [updatePreference, { loading: updatingPref }] = useMutation(UPDATE_PREFERENCE, {
    refetchQueries: [{ query: PROFILE_QUERY }],
  });

  useEffect(() => {
    if (userData && userData.profile) {
      setUser(userData.profile);
      setProfileImg(userData.profile.profileImg || "");
      setUsername(userData.profile.username || "");
      setProfileMessage(userData.profile.profileMessage || "");
      setRank(userData.profile.rank || "Bronze");
      setAge(userData.profile.age ? String(userData.profile.age) : "");
      setPlaystyle(userData.profile.preferences?.playstyle || "CASUAL");
      setRegion(userData.profile.preferences?.region || "NA");
      setFavoritePlatform(userData.profile.preferences?.favoritePlatform || "PC");
      setFavoriteGameGenre(userData.profile.preferences?.favoriteGameGenre || "RPG");
    }
  }, [userData]);

  if (!user) {
    return <View><Text>Loading...</Text></View>;
  }

  const handleSave = async () => {
    try {
      await updateUser({
        variables: {
          username: username || user.username,
          profileImg: profileImg || user.profileImg,
          profileMessage: profileMessage || user.profileMessage,
          rank: rank || user.rank,
          age: age !== "" ? parseInt(age) : user.age,
        },
        refetchQueries: [{ query: PROFILE_QUERY }],
      });
      await updatePreference({
        variables: {
          playstyle: playstyle || user.preferences?.playstyle || "CASUAL",
          region: region || user.preferences?.region || "NA",
          favoritePlatform: favoritePlatform || user.preferences?.favoritePlatform || "PC",
          favoriteGameGenre: favoriteGameGenre || user.preferences?.favoriteGameGenre || "RPG",
        },
        refetchQueries: [{ query: PROFILE_QUERY }],
      });
      if (apolloRefetch) {
        const { data } = await apolloRefetch();
        if (data && data.profile && setUser) {
          setUser(data.profile);
        }
      }
      setEditing(false);
      Alert.alert("Profile updated!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setProfileImg(user.profileImg || "");
    setUsername(user.username || "");
    setProfileMessage(user.profileMessage || "");
    setRank(user.rank || "Bronze");
    setAge(user.age ? String(user.age) : "");
    setPlaystyle(user.preferences?.playstyle || "CASUAL");
    setRegion(user.preferences?.region || "NA");
    setFavoritePlatform(user.preferences?.favoritePlatform || "PC");
    setFavoriteGameGenre(user.preferences?.favoriteGameGenre || "RPG");
    setEditing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={24} color="#007BFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={profileImg ? { uri: profileImg } : defaultAvatar}
            alt={username || "User Avatar"}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{user.username || "User Name"}</Text>
            <Text style={styles.userTag}>@{user.username || "username"}</Text>
            <Text style={styles.level}>
              Status: {user.status || "N/A"}
            </Text>
            <Text style={styles.level}>
              Age: {user.age ? user.age : "N/A"}
            </Text>
            {editing && (
              <>
                <Text style={styles.editLabel}>Change Username:</Text>
                <TextInput
                  style={styles.editField}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="New Username"
                />
                <Text style={styles.editLabel}>Change Profile Image URL:</Text>
                <TextInput
                  style={styles.editField}
                  value={profileImg}
                  onChangeText={setProfileImg}
                  placeholder="Profile Image URL"
                />
                <Text style={styles.editLabel}>Change Age:</Text>
                <TextInput
                  style={styles.editField}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </>
            )}
          </View>
          {!editing ? (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="pencil-outline" size={16} color="#007BFF" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bioHeader}>Bio</Text>
          {editing ? (
            <TextInput
              style={styles.bioText}
              value={profileMessage}
              onChangeText={setProfileMessage}
              placeholder="Bio"
              multiline
            />
          ) : (
            <Text style={styles.bioText}>
              {user.profileMessage || "No bio available"}
            </Text>
          )}

          <View style={styles.bioDetails}>
            <View style={styles.bioDetailItem}>
              <Text style={styles.bioDetailLabel}>Reputation</Text>
              <Text style={styles.bioDetailValue}>{user.reputation || "0"}</Text>
            </View>
            <View style={styles.bioDetailItem}>
              <Text style={styles.bioDetailLabel}>Rank</Text>
              {editing ? (
                <Dropdown
                  value={rank}
                  options={RANKS}
                  onChange={setRank}
                />
              ) : (
                <Text style={styles.bioDetailValue}>{user.rank || "N/A"}</Text>
              )}
            </View>
          </View>

          <View style={styles.preferencesContainer}>
            <Text style={styles.preferencesHeader}>Preferences</Text>
            <Text style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Region: </Text>
              {editing ? (
                <Dropdown
                  value={region}
                  options={REGIONS}
                  onChange={setRegion}
                />
              ) : (
                <Text style={styles.preferenceValue}>{user.preferences?.region || "N/A"}</Text>
              )}
            </Text>
            <Text style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Playstyle: </Text>
              {editing ? (
                <Dropdown
                  value={playstyle}
                  options={PLAYSTYLES}
                  onChange={setPlaystyle}
                />
              ) : (
                <Text style={styles.preferenceValue}>{user.preferences?.playstyle || "N/A"}</Text>
              )}
            </Text>
            <Text style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Favorite Platform: </Text>
              {editing ? (
                <Dropdown
                  value={favoritePlatform}
                  options={PLATFORMS}
                  onChange={setFavoritePlatform}
                />
              ) : (
                <Text style={styles.preferenceValue}>{user.preferences?.favoritePlatform || "N/A"}</Text>
              )}
            </Text>
            <Text style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Favorite Game Genre: </Text>
              {editing ? (
                <Dropdown
                  value={favoriteGameGenre}
                  options={GENRES}
                  onChange={setFavoriteGameGenre}
                />
              ) : (
                <Text style={styles.preferenceValue}>{user.preferences?.favoriteGameGenre || "N/A"}</Text>
              )}
            </Text>
          </View>
          {editing && (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.editProfileButton, { marginRight: 10 }]}
                onPress={handleSave}
                disabled={updatingUser || updatingPref}
              >
                <Ionicons name="save-outline" size={16} color="#007BFF" />
                <Text style={styles.editProfileText}>
                  {updatingUser || updatingPref ? "Saving..." : "Save Edits"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editProfileButton, { backgroundColor: "#eee" }]}
                onPress={handleCancel}
                disabled={updatingUser || updatingPref}
              >
                <Ionicons name="close-outline" size={16} color="#888" />
                <Text style={[styles.editProfileText, { color: "#888" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Dropdown = ({ value, options, onChange }) => (
  <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, marginVertical: 4 }}>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={{ height: 36, width: 180, color: "#222" }}
      itemStyle={{ color: "#222" }}
    >
      {!options.includes(value) && value ? (
        <Picker.Item label={`Current: ${value}`} value={value} color="#888" />
      ) : null}
      {options.map((opt) => (
        <Picker.Item
          key={opt}
          label={opt === value ? `Current: ${opt}` : opt}
          value={opt}
        />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  settingsIcon: {
    position: "absolute",
    top: 30,
    right: 10,
    zIndex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userTag: {
    fontSize: 14,
    color: "#888",
  },
  level: {
    fontSize: 14,
    color: "#666",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: "auto",
  },
  editProfileText: {
    fontSize: 14,
    color: "#007BFF",
    marginLeft: 5,
  },
  bioContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  bioHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 10,
  },
  bioDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bioDetailItem: {
    alignItems: "center",
  },
  bioDetailLabel: {
    fontSize: 12,
    color: "#888",
  },
  bioDetailValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activityContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeMore: {
    fontSize: 14,
    color: "#007BFF",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activityIcon: {
    marginRight: 10,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
  },
  noActivityText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  preferencesContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  preferencesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  preferenceItem: {
    fontSize: 14,
    marginBottom: 2,
  },
  preferenceLabel: {
    color: "#888",
  },
  preferenceValue: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  editField: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});