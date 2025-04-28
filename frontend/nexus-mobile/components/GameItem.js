import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const GameItem = ({ title, logo, shortDescription }) => {
  const navigation = useNavigation();
  const isSvg = logo.endsWith('.svg') || logo.includes('svg');

  const handlePress = () => {
    navigation.navigate('Dashboard', { gameTitle: title });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.wrapper}>
      <View style={styles.gameItem}>
        {isSvg ? (
          <SvgUri  uri={ logo } style={styles.gameIcon}/>
        ) : (
          <Image source={{ uri: logo }} style={styles.gameIcon}/>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.gameTitle}>{title}</Text>
          {shortDescription && (
            <Text style={styles.gameDescription}>{shortDescription}</Text>
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