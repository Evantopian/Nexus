import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import Config from "react-native-config";
import axios from "axios";

import Landing from "./routes/Landing";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import ForgotPassword from "./routes/ForgetPassword";
import BottomNav from "./navigation/BottomNav";
import Dashboard from './components/Dashboard';

const Stack = createStackNavigator();

axios.defaults.baseURL = Config.API_BASE_URL;
console.log("API Base URL:", Config.API_BASE_URL);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Main Content" component={BottomNav} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}