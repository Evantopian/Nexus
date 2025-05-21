import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GameCard from "../../components/Cards/GameCard";
import GuildCard from "../../components/Cards/GuildCard";
import PlayerCard from "../../components/Cards/PlayerCard";
import GroupCard from "../../components/Cards/GroupCard";
import { useGames } from "../../context/GameContext";
import { useQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS } from "../../graphql/user/userQueries";
import { GET_ALL_LFG_POSTS } from "../../graphql/lfg/lfgQueries";
import { useAuth } from "../../context/AuthContext";
import { getAllGuilds } from "../../data/DummyGameData";

export default function FilterBox({ topPadding }) {
  const [selectedCategory, setSelectedCategory] = useState("Games");
  const [searchQuery, setSearchQuery] = useState("");
  const { games } = useGames();
  const { user } = useAuth();

  const { data: playerData, loading: playerLoading, error: playerError } = useQuery(GET_RECOMMENDATIONS, {
    variables: { userId: user?.uuid, numRecommendations: 10 },
    skip: selectedCategory !== "Players" || !user?.uuid,
  });

  const { data: lfgData, loading: lfgLoading, error: lfgError } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 50, offset: 0 },
    skip: selectedCategory !== "Groups",
  });

  const getData = () => {
    let data = [];
    if (selectedCategory === "Games") data = games;
    if (selectedCategory === "Guilds") data = getAllGuilds();
    if (selectedCategory === "Players") {
      if (playerData && playerData.getRecommendations) {
        data = playerData.getRecommendations;
      }
    }
    if (selectedCategory === "Groups") {
      if (lfgData && lfgData.getAllLFGPosts) {
        data = lfgData.getAllLFGPosts;
      }
    }

    if (searchQuery.trim() !== "") {
      return data.filter((item) =>
        (item.name || item.title || item.username || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data.slice(0, 10);
  };

  const renderItem = ({ item }) => {
    if (selectedCategory === "Games") return <GameCard game={item} />;
    if (selectedCategory === "Guilds") return <GuildCard server={item} />;
    if (selectedCategory === "Players") return <PlayerCard player={item} />;
    if (selectedCategory === "Groups") return <GroupCard group={item} />;
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterBox}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === "Games" && styles.activeFilterButton,
          ]}
          onPress={() => setSelectedCategory("Games")}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === "Games" && styles.activeFilterText,
            ]}
          >
            Games
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === "Guilds" && styles.activeFilterButton,
          ]}
          onPress={() => setSelectedCategory("Guilds")}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === "Guilds" && styles.activeFilterText,
            ]}
          >
            Guilds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === "Players" && styles.activeFilterButton,
          ]}
          onPress={() => setSelectedCategory("Players")}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === "Players" && styles.activeFilterText,
            ]}
          >
            Players
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedCategory === "Groups" && styles.activeFilterButton,
          ]}
          onPress={() => setSelectedCategory("Groups")}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === "Groups" && styles.activeFilterText,
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getData()}
        keyExtractor={(item, index) => item.id?.toString() || item.uuid?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          selectedCategory === "Players"
            ? playerLoading
              ? <Text style={styles.emptyText}>Loading player...</Text>
              : playerError
                ? <Text style={styles.emptyText}>Error loading player</Text>
                : <Text style={styles.emptyText}>No player found</Text>
            : <Text style={styles.emptyText}>No data available</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeFilterButton: {
    backgroundColor: "#4f46e5",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  gameText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
  },
});