import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from "../screen/Main/Main.tsx";
import FavoritesScreen from "../screen/Main/FavouritesScreen.tsx";
import {MainStackParamList} from "../types/navigation-types.ts";
import WeatherForecastScreen from "../screen/Main/WeatherForecastScreen.tsx";

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Избранные города' }} />
            <Stack.Screen name="Forecast" component={WeatherForecastScreen} options={{ title: 'Прогноз погоды' }} />
        </Stack.Navigator>
    );
};

export default MainStack;
