import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MapScreen } from "../screen/Map/MapScreen";
import { SearchScreen } from "../screen/Search/SearchScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { AppColors } from "../constants/Colors";
import { RootTabParamList } from "../types/navigation-types";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabsNavigator(): React.ReactNode {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            return (
              <Icon
                name={route.name === "Map" ? "map" : "search"}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: AppColors.blue,
          tabBarInactiveTintColor: AppColors.gray,
          headerShown: false
        })}>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
