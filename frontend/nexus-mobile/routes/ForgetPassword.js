import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState("");

    const handleResetPassword = () => {
        if (!email.includes("@")) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }
        
        // Simulate API request for password reset
        Alert.alert("Check Your Email", "A password reset link has been sent to your email.");
        navigation.navigate("Login"); // Navigate back to Login page
    };

    return (
        <LinearGradient
            colors={["#000000", "#121025", "#292649"]}
            locations={[0.03, 0.49, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.headerText}>Forgot Password</Text>
            <Text style={styles.subText}>Enter your email address to receive a password reset link.</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.backToLogin}>← Back to Login</Text>
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
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subText: {
        color: "#bbb",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        backgroundColor: "#1f1f1f",
        color: "white",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        width: "100%",
        backgroundColor: "white",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
    },
    backToLogin: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 20,
    },
});