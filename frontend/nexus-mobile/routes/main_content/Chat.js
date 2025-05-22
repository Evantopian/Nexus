import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import chatQueries from "../../graphql/chat/ChatQueries";
import defaultAvatar from "../../assets/cinnamoroll.jpg";
import LFGChat from "../../components/LFGChat";

export default function Chat({ topPadding }) {
  const [selectedChat, setSelectedChat] = useState(null);

  if (selectedChat) {
    return (
      <LFGChat
        item={selectedChat}
        onBack={() => setSelectedChat(null)}
        topPadding={topPadding}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <Text style={styles.sectionTitle}>Chats</Text>
      <FlatList
        data={chatQueries}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => setSelectedChat(item)}>
            <Image
              source={
                item.users[0]?.image
                  ? { uri: item.users[0].image }
                  : defaultAvatar
              }
              style={styles.avatar}
            />
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: "100%",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  chatName: {
    fontSize: 20,
    fontWeight: "500",
  },
});