import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./routes/Landing";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import BottomNav from "./navigation/BottomNav";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main Content" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}