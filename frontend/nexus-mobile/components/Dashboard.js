import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import GuildsRoute from './DashboardContent/GuildsRoute';
import PlayersRoute from './DashboardContent/PlayersRoute';
import LFGRoute from './DashboardContent/LFGRoute';

export default function Dashboard({ route }) {
  const layout = useWindowDimensions();
  const { game } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'guilds', title: 'Guilds' },
    { key: 'players', title: 'Players' },
    { key: 'lfg', title: 'LFG' },
  ]);

  const backgroundImage = game?.banner || game?.image;

  const renderScene = SceneMap({
    guilds: () => <GuildsRoute gameData={game} />,
    players: () => <PlayersRoute gameData={game} />,
    lfg: () => <LFGRoute gameData={game} />,
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.gameTitleBackground}
        resizeMode="cover"
      >
        <Text style={styles.gameTitle}>{game.title}</Text>
      </ImageBackground>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#4f46e5' }}
            style={[styles.tabBar]}
            labelStyle={[styles.tabLabel, { fontSize: 12, flexShrink: 1 }]}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#1f2937',
    height: 50,
  },
  gameTitleBackground: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});