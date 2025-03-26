import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { validateEmail, validatePassword, validateUsername } from "../utils/validator";

export default function Signup({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSignup = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const usernameError = validateUsername(username);

        if (emailError || passwordError || usernameError) {
            Alert.alert("Invalid Input", emailError || passwordError || usernameError);
            return;
        }

        //Temp placeholder
        console.log("Signup successful with:", { email, password, username });
        navigation.navigate("Main Content");
    };

    return (
        <LinearGradient
            colors={["#000000", "#121025", "#292649"]}
            locations={[0.03, 0.49, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.headerText}>Sign Up to Nexus</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <Text style={styles.passwordHint}>
                Should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
            </Text>

            <TextInput
                placeholder="Username"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <Text style={styles.passwordHint}>
                Can only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signInLink}>Sign In →</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

export const styles = StyleSheet.create({
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
    passwordHint: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 12,
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
    signInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    signInText: {
        color: '#bbb',
        fontSize: 14,
    },
    signInLink: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
});
