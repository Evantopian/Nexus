import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
} from "lucide-react-native";
import cinnamoroll from "../../assets/cinnamoroll.jpg";

const ProfileSettings = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={cinnamoroll} style={styles.avatar} />
        <View>
          <Text style={styles.username}>@Tamothy</Text>
          <Text style={styles.level}>Level 21 • Okayish Gamer</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Profile")}>
          <User size={20} color="#888" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
          <Settings size={20} color="#888" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Notifications")}>
          <Bell size={20} color="#888" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Help")}>
          <HelpCircle size={20} color="#888" />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={() => navigation.navigate("Login")}>
          <LogOut size={20} color="#E53E3E" />
          <Text style={[styles.menuText, { color: "#E53E3E" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    fontSize: 20,
    fontWeight: "bold",
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

export default ProfileSettings;