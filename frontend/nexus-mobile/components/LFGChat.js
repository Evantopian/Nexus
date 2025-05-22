import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { PROFILE_QUERY } from "../graphql/user/userQueries";
import defaultAvatar from "../assets/cinnamoroll.jpg";

const CURRENT_USER_ID = 99;

export default function LFGChat({ item, onBack, topPadding = 0, currentUserId = CURRENT_USER_ID }) {
  const { data } = useQuery(PROFILE_QUERY);
  const currentUsername = data?.profile?.username || "You";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    (item.messages || []).map(msg => ({
      ...msg,
      sender: item.users.find(u => u.id === msg.senderId),
      body: msg.text,
    }))
  );

  const currentUser = item.users.find(u => u.id === currentUserId) || { id: currentUserId, username: currentUsername };

  const handleSend = () => {
    if (message.trim() === "" || !currentUser) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        body: message,
        sender: { ...currentUser, username: currentUsername },
        senderId: currentUserId,
      },
    ]);
    setMessage("");
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#007BFF" />
        </TouchableOpacity>
        <Image
          source={
            item.users[0]?.image
              ? { uri: item.users[0].image }
              : defaultAvatar
          }
          style={styles.avatar}
        />
        <Text style={styles.chatName}>{item.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(msg) => msg.id?.toString()}
        renderItem={({ item: msg }) => (
          <View
            style={[
              styles.messageRow,
              msg.sender?.username === currentUsername
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text style={styles.sender}>
              {msg.sender?.username || msg.sender?.name || "Unknown"}:
            </Text>
            <Text style={styles.messageBody}>{msg.body}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  chatName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageRow: {
    marginBottom: 14,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e6f0ff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#007BFF",
  },
  messageBody: {
    fontSize: 16,
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 10,
  },
});