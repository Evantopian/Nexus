import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const GuildCard = ({ server }) => {
  const isSvg = server.image.endsWith('.svg') || server.image.includes('svg');

  return (
    <View style={styles.card}>
      {isSvg ? (
        <SvgUri uri={server.image} style={styles.image} />
      ) : (
        <Image source={{ uri: server.image }} style={styles.image} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{server.name}</Text>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{server.description}</Text>
        <View style={styles.memberRow}>
          <Ionicons name="people" size={18} color="#90ee90" />
          <Text style={styles.memberCount}>{server.members}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinText}>+ Request to Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2f2f2f',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 3,
    height: 200,
  },
  image: {
    width: '40%',
    backgroundColor: '#ccc',
  },
  infoContainer: {
    flex: 2,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 6,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    color: '#90ee90',
    marginLeft: 4,
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  joinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default GuildCard;