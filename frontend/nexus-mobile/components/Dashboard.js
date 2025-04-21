import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const GuildsRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.contentText}>Guilds / Factions / Servers content</Text>
  </View>
);

const PlayersRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.contentText}>Players content</Text>
  </View>
);

const LFGRoute = () => (
  <View style={styles.scene}>
    <Text style={styles.contentText}>Looking for Group content</Text>
  </View>
);

export default function Dashboard() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'guilds', title: 'Guilds/Factions/Servers' },
    { key: 'players', title: 'Players' },
    { key: 'lfg', title: 'LFG' },
  ]);

  const renderScene = SceneMap({
    guilds: GuildsRoute,
    players: PlayersRoute,
    lfg: LFGRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={{ backgroundColor: '#4f46e5' }}
          style={[styles.tabBar, { paddingHorizontal: 10 }]}
          labelStyle={[styles.tabLabel, { fontSize: 12, flexShrink: 1 }]}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
    scene: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    tabLabel: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      textTransform: 'none',
      flexShrink: 1,
    },
    tabBar: {
      backgroundColor: '#1f2937',
      height: 50,
    },
  });