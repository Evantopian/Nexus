import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { ApolloProvider } from "@apollo/client";
import Constants from 'expo-constants';
import axios from "axios";

import client from "./lib/apollo-client";
import Landing from "./routes/Landing";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import ForgotPassword from "./routes/ForgetPassword";
import BottomNav from "./navigation/BottomNav";
import Dashboard from './components/Dashboard';
import Settings from './components/Settings/Settings';

const Stack = createStackNavigator();
const { API_BASE_URL } = Constants.expoConfig.extra;

axios.defaults.baseURL = API_BASE_URL;

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <GameProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Landing" component={Landing} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="Main Content" component={BottomNav} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
          </NavigationContainer>
        </GameProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}