import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_LFG_POST } from "../../graphql/lfg/lfgMutations";

export default function CreateGroupModal({ visible, onClose, onSubmit, gameId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [expirationHour, setExpirationHour] = useState("");
  const [requirements, setRequirements] = useState("");

  const [createLFGPost, { loading: creating }] = useMutation(CREATE_LFG_POST);

  useEffect(() => {
    if (!visible) {
      setTitle("");
      setDescription("");
      setTags("");
      setExpirationHour("");
      setRequirements("");
    }
  }, [visible]);

  const handleCreate = async () => {
    if (!gameId || !title || !description) {
      Alert.alert("Missing Fields", "Game, Title, and Description are required.");
      return;
    }
    try {
      await createLFGPost({
        variables: {
          gameId,
          title,
          description,
          requirements: requirements
            ? requirements.split(",").map((r) => r.trim()).filter(Boolean)
            : [],
          tags: tags
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          expirationHour: expirationHour ? parseInt(expirationHour) : undefined,
        },
      });
      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      Alert.alert("Error", "Failed to create group.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Create Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Title (required)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (required)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Requirements (comma separated, optional)"
            value={requirements}
            onChangeText={setRequirements}
          />
          <TextInput
            style={styles.input}
            placeholder="Tags (comma separated, optional)"
            value={tags}
            onChangeText={setTags}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiration Hour (optional, number)"
            value={expirationHour}
            onChangeText={setExpirationHour}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={creating}>
              <Text style={styles.buttonText}>{creating ? "Creating..." : "Create"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose} disabled={creating}>
              <Text style={[styles.buttonText, { color: "#888" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancel: {
    backgroundColor: "#eee",
  },
});