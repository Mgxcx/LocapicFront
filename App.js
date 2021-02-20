import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ChatScreen from "./screens/ChatScreen";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import pseudo from "./reducers/pseudo";

LogBox.ignoreAllLogs();

const store = createStore(combineReducers({ pseudo }));

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PagesTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "ios-navigate";
          } else if (route.name === "Chat") {
            iconName = "ios-chatboxes";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#eb4d4b",
        inactiveTintColor: "#FFFFFF",
        activeBackgroundColor: "#130f40",
        inactiveBackgroundColor: "#130f40",
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="PagesTab" component={PagesTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
