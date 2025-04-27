import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import GuildCard from '../Cards/GuildCard';

const GuildsRoute = ({ gameData }) => {
  const servers = gameData?.servers;
  return (
    <View style={styles.scene}>
      <Text style={styles.contentText}>Guilds / Factions / Servers content</Text>
      {servers && servers.length > 0 ? (
        <FlatList
          data={servers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GuildCard server={item} />} 
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noServersText}>No Guilds Created</Text>
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
  noServersText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GuildsRoute;