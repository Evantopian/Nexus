import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../routes/main_content/Home";
import Search from "../routes/main_content/Search";
import ProfileSettings from "../routes/main_content/ProfileSettings";
import Chat from "../routes/main_content/Chat";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          }else if (route.name === "ProfileSettings") {
            return <Image
              source={require("../assets/cinnamoroll.jpg")}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: focused ? 2 : 1,
                borderColor: color,
              }}
            />
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 10, height: 70 },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="ProfileSettings" component={ProfileSettings} />
    </Tab.Navigator>
  );
};

export default BottomNav;
