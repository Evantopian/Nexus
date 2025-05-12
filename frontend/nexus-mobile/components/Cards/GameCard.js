import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GameCard = ({ game }) => {
    const navigation = useNavigation();
    const isSvg = game.image.endsWith('.svg') || game.image.includes('svg');
    const [isFollowing, setIsFollowing] = useState(false);

    const handlePress = () => {
        navigation.navigate('Dashboard', { game });
    };

    const toggleFollow = () => {
        setIsFollowing((prev) => !prev);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            {isSvg ? (
                <SvgUri uri={game.image} style={styles.image} />
            ) : (
                <Image source={{ uri: game.image }} style={styles.image} />
            )}
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{game.title}</Text>
                    <TouchableOpacity onPress={toggleFollow}>
                        <Ionicons
                            name={isFollowing ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFollowing ? 'red' : '#ccc'}
                            style={styles.followIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.description}>{game.shortDescription}</Text>
                <View style={styles.memberRow}>
                    <Ionicons name="people" size={18} color="#90ee90" />
                    <Text style={styles.memberCount}>{game.players}</Text>
                </View>

                <View style={styles.tagsContainer}>
                    {game.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  followIcon: {
    marginLeft: 10,
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    color: '#ddd',
    fontSize: 12,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    overflow: 'hidden',
  },
  tag: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GameCard;