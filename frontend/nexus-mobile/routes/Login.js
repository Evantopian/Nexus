import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";

export default function Login({ navigation }) {
  return (
    <LinearGradient
      colors={["#000000", "#121025", "#292649"]}
      locations={[0.03, 0.49, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
        {/* Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        {/* Login Header */}
        <Text style={styles.headerText}>Login to Nexus</Text>

        {/* Username Input */}
        <TextInput
            placeholder="Username"
            placeholderTextColor="#ccc"
            style={styles.input}
        />

        {/* Password Input */}
        <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
    
        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signUpLink}>Sign Up →</Text>
            </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Terms  |  Privacy  |  Docs</Text>
            <Text style={styles.footerText}>Contact Support | Manage Cookies</Text>
            <Text style={styles.footerText}>Do not share my personal information</Text>
        </View>
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
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#1f1f1f',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  forgotPassword: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    color: '#bbb',
    fontSize: 14,
  },
  signUpLink: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#777',
    fontSize: 12,
  },
});