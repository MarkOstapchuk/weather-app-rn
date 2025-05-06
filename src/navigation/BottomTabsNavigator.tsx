import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MapScreen } from "../screen/Map/MapScreen";
import { SearchScreen } from "../screen/Search/SearchScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { AppColors } from "../constants/Colors";
import { RootTabParamList } from "../types/navigation-types";
import MainStack from "./MainStack.tsx";
import FeaturesStack from "./FeaturesStack.tsx";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabsNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

            if (route.name === "Main") {
              iconName = "home";
            } else if (route.name === "Map") {
              iconName = "map";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Features") {
                iconName = "apps-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: AppColors.blue,
          tabBarInactiveTintColor: AppColors.gray,
          headerShown: false
        })}>
        <Tab.Screen name="Main" component={MainStack} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Features" component={FeaturesStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
