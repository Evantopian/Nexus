import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Searchbar } from 'react-native-paper';

export default function Search({topPadding} ){
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Search Screen</Text>
        <Text style={styles.text}>Search for a game/party for you!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
