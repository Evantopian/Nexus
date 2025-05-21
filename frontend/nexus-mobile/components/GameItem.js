import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameItem = ({ game }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Dashboard', { game });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.wrapper}>
      <View style={styles.gameItem}>
        <Image source={{ uri: game.logo }} style={styles.gameIcon} />

        <View style={{ flex: 1 }}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          {game.shortDescription && (
            <Text style={styles.gameDescription}>{game.shortDescription}</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  gameDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    maxWidth: 240,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    marginTop: 8,
  },
});

export default GameItem;