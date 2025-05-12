import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function Settings({ topPadding }) {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = async () => {
    setError("");
    try {
      await logout();
      navigation.navigate("Login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <MaterialIcons name="dark-mode" size={20} color="#888" />
          <Text style={styles.menuText}>Dark/Light Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            style={styles.switch}
          />
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Notifications")}>
          <Ionicons name="notifications-outline" size={20} color="#888" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {handleSubmit}}>
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
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
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
    height: 60,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  switch: {
    marginLeft: "auto",
  },
  logout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});