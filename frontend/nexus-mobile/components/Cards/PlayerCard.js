import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { Ionicons } from '@expo/vector-icons';

const PlayerCard = ({ player }) => {
  const isSvg = player.avatar.endsWith('.svg') || player.avatar.includes('svg');
  const isVerified = player.role === 'verified'; 
  return (
    <View style={styles.card}>
      {isSvg ? (
        <SvgUri source={{ uri: player.avatar }} style={styles.image} />
      ) : (
        <Image source={{ uri: player.avatar }} style={styles.image} />
      )}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.title}>{player.name}</Text>
          {isVerified && (
            <Ionicons name="checkmark-circle" size={18} color="#4caf50"/>
          )}
        </View>
        <Text style={styles.label}>Level:</Text>
        <Text style={styles.level}>{player.level}</Text>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.status}>{player.status}</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinText}>+ Add Friend</Text>
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
    marginHorizontal: 10,
    elevation: 3,
    height: 200,
  },
  image: {
    flex: 1.5,
    resizeMode: 'cover',
    backgroundColor: '#ccc',
  },
  infoContainer: {
    flex: 2,
    padding: 10,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5, 
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  level: {
    color: '#90ee90',
    fontSize: 14,
    fontWeight: 'bold',
  },
  status: {
    color: '#00ff00',
    fontSize: 14,
    fontStyle: 'italic',
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

export default PlayerCard;