import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';

const GroupCard = ({ group }) => {
  const isSvg = group.author.avatar.endsWith('.svg') || group.author.avatar.includes('svg');

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{group.title}</Text>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{group.description}</Text>
        {group.requirements?.length > 0 && (
          <>
            <Text style={styles.label}>Requirements:</Text>
            <View style={styles.bubblesContainer}>
              {group.requirements.map((req, index) => (
                <View key={`req-${index}`} style={styles.ReqBubble}>
                  <Text style={styles.bubbleText}>{req}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        {group.tags?.length > 0 && (
          <>
            <Text style={styles.label}>Tags:</Text>
            <View style={styles.bubblesContainer}>
              {group.tags.map((tag, index) => (
                <View key={`tag-${index}`} style={styles.TagBubble}>
                  <Text style={styles.bubbleText}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.authorRow}>
          {isSvg ? (
            <SvgUri uri={ group.author.avatar } style={styles.avatar} />
          ) : (
            <Image source={{ uri: group.author.avatar }} style={styles.avatar} />
          )}
          <Text style={styles.authorName}>{group.author.name}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinText}>Join Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#2f2f2f',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 3,
    padding: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  ReqBubble: {
    backgroundColor: '#4a5568',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  TagBubble: {
    backgroundColor: '#2a4365',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  bubbleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  authorName: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
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

export default GroupCard;