import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlayerCard = ({ player }) => {
  return (
    <View style={styles.card}>
      {player.profileImg ? (
        <Image source={{ uri: player.profileImg }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" }]}>
          <Ionicons name="person-circle" size={64} color="#888" />
        </View>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.title}>{player.username} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Region: <Text style={styles.value}>{player.region || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Age: <Text style={styles.value}>{player.age ?? "N/A"}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Genre: <Text style={styles.value}>{player.genre || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Platform: <Text style={styles.value}>{player.platform || "N/A"}</Text>
          </Text>
        </View>
        <Text style={styles.label}>
          Playstyle: <Text style={styles.value}>{player.playstyle || "N/A"}</Text>
        </Text>
        <Text style={styles.label}>
          Rank: <Text style={styles.value}>{player.rank || "N/A"}</Text>
        </Text>
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
    width: 110,
    height: 200,
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
    marginBottom: 4,
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
    marginTop: 2,
  },
  value: {
    color: '#90ee90',
    fontSize: 12,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
});

export default PlayerCard;