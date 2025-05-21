import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../assets/cinnamoroll.jpg";

export default function ProfileSettings({ topPadding }) {
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={24} color="#007BFF" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={user.profileImg || defaultAvatar}
          alt={user.username || "User Avatar"}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{user.username || "User Name"}</Text>
          <Text style={styles.userTag}>@{user.username || "username"}</Text>
          <Text style={styles.level}>Status: {user.status || "offline"}</Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="pencil-outline" size={16} color="#007BFF" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioHeader}>Bio</Text>
        <Text style={styles.bioText}>
          {user.profileMessage || "No bio available"}
        </Text>

        <View style={styles.bioDetails}>
          <View style={styles.bioDetailItem}>
            <Text style={styles.bioDetailLabel}>Reputation</Text>
            <Text style={styles.bioDetailValue}>{user.reputation || "0"}</Text>
          </View>
          <View style={styles.bioDetailItem}>
            <Text style={styles.bioDetailLabel}>Rank</Text>
            <Text style={styles.bioDetailValue}>{user.rank || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.preferencesContainer}>
          <Text style={styles.preferencesHeader}>Preferences</Text>
          <Text style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Playstyle: </Text>
            <Text style={styles.preferenceValue}>{user.preferences?.playstyle || "N/A"}</Text>
          </Text>
          <Text style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Region: </Text>
            <Text style={styles.preferenceValue}>{user.preferences?.region || "N/A"}</Text>
          </Text>
          <Text style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Favorite Platform: </Text>
            <Text style={styles.preferenceValue}>{user.preferences?.favoritePlatform || "N/A"}</Text>
          </Text>
          <Text style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Favorite Game Genre: </Text>
            <Text style={styles.preferenceValue}>{user.preferences?.favoriteGameGenre || "N/A"}</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    fontSize: 25,
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
});