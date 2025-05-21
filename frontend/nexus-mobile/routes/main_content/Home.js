import React from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';
import GameItem from '../../components/GameItem';
import { useFollowedGames } from '../../context/FollowedGamesContext';

export default function Home({ topPadding }) {
  const { followedGames, loading } = useFollowedGames();

  const renderGame = ({ item }) => (
    <GameItem game={item} />
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <Text style={styles.sectionTitle}>For You</Text>
      <Text style={styles.subHeader}>Followed Games</Text>

      <FlatList
        data={followedGames}
        renderItem={renderGame}
        keyExtractor={(item) => item.id?.toString?.() || item.slug || String(item)}
        style={styles.gameList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading
            ? <Text>Loading...</Text>
            : <Text>No followed games yet.</Text>
        }
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