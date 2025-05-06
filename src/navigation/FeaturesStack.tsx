import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {FeaturesStackParamList} from "../types/navigation-types.ts";
import {FeaturesScreen} from "../screen/Features/FeaturesScreen.tsx";
import {HoroscopeListScreen} from "../screen/Features/HoroscopeScreen.tsx";
import {HoroscopeDetailScreen} from "../screen/Features/HoroscopeDetails.tsx";
import {AnimalActivityScreen} from "../screen/Features/AnimalActivilyScreen.tsx";
import MusicScreen from "../screen/Features/MusicScreen.tsx";

const Stack = createNativeStackNavigator<FeaturesStackParamList>();

const FeaturesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Features" component={FeaturesScreen}  options={{ title: 'Features' }} />
            <Stack.Screen name="Horoscope" component={HoroscopeListScreen}  options={{ title: 'Horoscope' }} />
            <Stack.Screen name="AnimalActivity" component={AnimalActivityScreen}  options={{ title: 'Animal activity' }} />
            <Stack.Screen name="HoroscopeDetails" component={HoroscopeDetailScreen} options={{ title: 'Horoscope details' }} />
            <Stack.Screen name="Music" component={MusicScreen} options={{ title: 'Playlist' }} />
        </Stack.Navigator>
    );
};

export default FeaturesStack;
