import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { getAllGames } from '../../data/DummyGameData';
import GameItem from '../../components/GameItem';

export default function Home({ topPadding }) {
  const gamesList = getAllGames().slice(0, 4);

  const renderGameItem = ({ item }) => (
    <GameItem
      title={item.title}
      logo={item.logo}
      shortDescription={item.shortDescription}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <Text style={styles.sectionTitle}>For You</Text>
      <Text style={styles.subHeader}>Followed Games</Text>

      <FlatList
        data={gamesList}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.gameList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  gameList: {
    marginBottom: 16,
  },
});