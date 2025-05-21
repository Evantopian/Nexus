import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PlayerCard from '../Cards/PlayerCard';
import { getGameBySlug } from '../../data/DummyGameData';

const PlayersRoute = ({ gameSlug }) => {
  const game = getGameBySlug(gameSlug);
  const topPlayers = game?.topPlayers || [];

  return (
    <View style={styles.scene}>
      <Text style={styles.contentText}>Top Players</Text>
      {topPlayers && topPlayers.length > 0 ? (
        <FlatList
          data={topPlayers}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <PlayerCard player={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noPlayersText}>No Players In This Category</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  contentText: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 10,
  },
  noPlayersText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlayersRoute;