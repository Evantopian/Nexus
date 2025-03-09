import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet} from 'react-native';

//*Temp Home Page
export default function Home({}){
  return (
    <LinearGradient
      colors={["#000000", "#121025", "#292649"]}
      locations={[0.03, 0.49, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.text}>Welcome to Home</Text> 
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});