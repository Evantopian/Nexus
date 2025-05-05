import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {login} from "../test";

export default function Landing({ navigation }) {
  return (
    <LinearGradient
      colors={["#000000", "#121025", "#292649"]}
      locations={[0.03, 0.49, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
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
          onPress={() => login()}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")} 
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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