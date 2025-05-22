import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import Search from "../routes/main_content/Search";
import ProfileSettings from "../routes/main_content/ProfileSettings";
import Chat from "../routes/main_content/Chat";
import { Ionicons } from "@expo/vector-icons";
import { Image, Platform, StatusBar } from "react-native";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  const topPadding = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "ProfileSettings") {
            const imgSource = user?.profileImg
              ? { uri: user.profileImg }
              : require("../assets/cinnamoroll.jpg");
            return (
              <Image
                source={imgSource}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: focused ? 2 : 1,
                  borderColor: color,
                }}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 10, height: 70 },
      }}
    >
      <Tab.Screen name="Home">
        {() => <HomeStack topPadding={topPadding} />}
      </Tab.Screen>
      <Tab.Screen name="Search">{() => <Search topPadding={topPadding} />}</Tab.Screen>
      <Tab.Screen name="Chat">{() => <Chat topPadding={topPadding} />}</Tab.Screen>
      <Tab.Screen name="ProfileSettings">
        {() => <ProfileSettings topPadding={topPadding} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomNav;
