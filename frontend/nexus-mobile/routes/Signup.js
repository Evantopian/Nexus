import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";

export default function Signup({ navigation }) {
    return (
      <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../assets/logo.png')} style={styles.logo} />
    
            {/* Sign-Up Header */}
            <Text style={styles.headerText}>Sign Up to Nexus</Text>
    
            {/* Email Input */}
            <TextInput
            placeholder="Email"
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
            <Text style={styles.passwordHint}>
            Should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
            </Text>
    
            {/* Username Input */}
            <TextInput
            placeholder="Username"
            placeholderTextColor="#ccc"
            style={styles.input}
            />
            <Text style={styles.passwordHint}>
            Can only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
            </Text>
    
            {/* Continue Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
    
            {/* Sign In Link */}
            <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign In →</Text>
            </TouchableOpacity>
            </View>
      </View>
    );
}

export const styles = StyleSheet.create({
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
