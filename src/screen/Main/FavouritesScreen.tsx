import React, { useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {CityItem} from "../../types/api-types.ts";
import Ionicons from "react-native-vector-icons/Ionicons";
const FavoritesScreen: React.FC = () => {
    const [cities, setCities] = useState<CityItem[]>([]);
    const navigation = useNavigation();

    useFocusEffect(() => {
        const loadFavorites = async () => {
            const stored = await AsyncStorage.getItem('favorites');
            setCities(stored ? JSON.parse(stored) : []);
        };
        loadFavorites();
    });

    const handleCityPress = async (city: CityItem) => {
        await AsyncStorage.setItem('SELECTED_CITY', JSON.stringify(city));
        navigation.goBack();
    };
    const removeFromFavourites = async (city: CityItem) => {
        const updatedCities = cities.filter((cityItem) => cityItem.name !== city.name);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedCities));
        Alert.alert(city.name + ' удалено')
        setCities(updatedCities)
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={cities}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleCityPress(item)}>
                        <Text style={styles.city}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removeFromFavourites(item)}>
                            <Ionicons
                                name={"heart"}
                                size={22}
                                color={"tomato"}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Нет избранных городов</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    card: {
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    city: {
        fontSize: 18,
        fontWeight: '500',
    },
    empty: {
        marginTop: 50,
        textAlign: 'center',
        color: '#888',
    },
});

export default FavoritesScreen;
