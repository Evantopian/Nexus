import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../routes/main_content/Home';
import Dashboard from '../components/Dashboard';

const Stack = createStackNavigator();

const HomeStack = ({ topPadding }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain">
        {() => <Home topPadding={topPadding} />}
      </Stack.Screen>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default HomeStack;