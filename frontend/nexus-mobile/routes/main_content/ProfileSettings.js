import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import cinnamoroll from "../../assets/cinnamoroll.jpg";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSettings({ topPadding }) {
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.header}>
        <Image 
          src={user.profileImg || "/default-avatar.png"} // Default avatar if none exists
          alt={user.username || "User Avatar"} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.username}>{user.username || "User Name"}</Text>
          <Text style={styles.userTag}>@{user.username || "username"}</Text>
          <Text style={styles.level}>Status: {user.status || "offline"}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-outline" size={20} color="#888" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications-outline" size={20} color="#888" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Help")}>
          <Ionicons name="help-circle-outline" size={20} color="#888" />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={() => navigation.navigate("Login")}>
          <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          <Text style={[styles.menuText, { color: "#E53E3E" }]}>Logout</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
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
  menu: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
