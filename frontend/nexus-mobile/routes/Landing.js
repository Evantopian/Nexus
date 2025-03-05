import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
        {/* Logo */}
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to Nexus</Text>

        {/* Image Placeholder */}
        <Image source={require("../assets/duck.png")} style={styles.imagePlaceholder} />

        {/* Subtitle */}
        <Text style={styles.subtitle}>Find the party that fits you</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")} 
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121025",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: "#003D80",
    height: 58,
    width: 325,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#010101",
    height: 58,
    width: 325,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});