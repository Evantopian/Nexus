import React from 'react';
import { View, Text, StyleSheet} from "react-native";

export default function Chat({topPadding }){
  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Text style={styles.title}>Chat Screen</Text>
      <Text style={styles.text}>Chat with your teammates.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});