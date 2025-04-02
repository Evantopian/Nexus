import { Alert } from "react-native";
import dummyUsers from "../data/DummyUsers";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : "Invalid email format.";
};
  
export const validatePassword = (password) => {
  const longEnough = password.length >= 15;
  const complexEnough = password.length >= 8 && /[a-z]/.test(password) && /\d/.test(password);
    
  return longEnough || complexEnough
    ? null
    : "Password must be at least 15 characters OR at least 8 characters including a number and a lowercase letter.";
};
  
export const validateUsername = (username) => {
  const usernameRegex = /^(?!-)([A-Za-z0-9-]+)(?<!-)$/;
  return usernameRegex.test(username) 
    ? null 
    : "Username can only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.";
};

export const validateLogin = (username, password, navigation) => {
  const user = dummyUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    navigation.navigate("Main Content");
  } else {
    Alert.alert("Login Failed", "Invalid username or password.");
  }
};

export const handleResetPassword = (email, navigation) => {
  const user = dummyUsers.find((u) => u.email === email.toLowerCase());

  if (!email.includes("@")) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return;
  }

  if (user) {
    Alert.alert("Check Your Email", "A password reset link has been sent to your email.");
    navigation.navigate("Login");
  } else {
    Alert.alert("Account has not been created with this email.");
  }
};