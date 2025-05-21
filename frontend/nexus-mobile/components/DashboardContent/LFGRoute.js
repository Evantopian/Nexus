import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import GroupCard from '../Cards/GroupCard';
import { useQuery } from '@apollo/client';
import { GET_LFG_POSTS_BY_SLUG } from '../../graphql/lfg/lfgQueries';

const LFGRoute = ({ gameSlug, onCreateGroup }) => {
  const { data, loading, error } = useQuery(GET_LFG_POSTS_BY_SLUG, {
    variables: { slug: gameSlug },
    skip: !gameSlug,
  });

  const groups = data?.getLFGPosts || [];

  return (
    <View style={styles.scene}>
      <View style={styles.headerRow}>
        <Text style={styles.contentText}>Groups</Text>
        <TouchableOpacity style={styles.createButton} onPress={onCreateGroup}>
          <Text style={styles.createButtonText}>+ Create a Group</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.noGroupsText}>Error loading groups.</Text>
      ) : groups && groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GroupCard group={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noGroupsText}>No Group Created</Text>
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
  createButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  noGroupsText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LFGRoute;