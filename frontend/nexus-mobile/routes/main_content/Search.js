import React from "react";
import { View, Text, StyleSheet} from "react-native";

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Screen</Text>
      <Text style={styles.text}>Search for a game/party for you!</Text>
    </View>
  );
};

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

export default Profile;
