import React, { useState} from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppColors } from "../../constants/Colors";
import { styles } from "./SearchStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCitiesByName } from "../../api/api";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {CityItem} from "../../types/api-types.ts";
import {WeatherCard} from "../../components/WeatherCard.tsx";
import {StackNavigationProp} from "@react-navigation/stack";
import {MainStackParamList} from "../../types/navigation-types.ts";

export const SearchScreen = () => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<CityItem[]>([]);
  const [favorites, setFavorites] = useState<CityItem[]>([]);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };
  const handleSearch = async () => {
    if (!inputText.trim()) {
      Alert.alert("Ошибка", "Введите название города");
      return;
    }

    try {
      const cities = await fetchCitiesByName(inputText.trim());
      setResults(cities);
    } catch (err) {
      Alert.alert("Ошибка", "Не удалось найти города");
    }
  };
  const toggleFavorite = async (city: CityItem): Promise<void> => {
    const exists = isFavorite(city);
    let updated: CityItem[];

    if (exists) {
      updated = favorites.filter(
          (fav) =>
              !(fav.name === city.name && fav.country === city.country)
      );
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      Alert.alert("Удалено", `${city.name} удалён из избранного`);
    } else {
      updated = [...favorites, city];
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      Alert.alert("Добавлено", `${city.name} добавлен в избранное`);
    }

    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };
  const isFavorite = (city: CityItem): boolean => {
    return favorites.some(
        (fav) => fav.name === city.name && fav.country === city.country
    );
  };


  const handleCityPress = async (city: CityItem) => {
    await AsyncStorage.setItem('SELECTED_CITY', JSON.stringify(city))
    navigation.navigate("Main");
  };

  useFocusEffect(() => {
    loadFavorites();
  });

  return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
              style={styles.textInput}
              placeholder="Введите название города"
              placeholderTextColor={AppColors.mediumGray}
              value={inputText}
              onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
        </View>

        <FlatList
            data={results}
            keyExtractor={(item, index) =>
                `${item.name}-${item.lat}-${item.lon}-${index}`
            }
            renderItem={({ item }) => {
              const isFav = isFavorite(item);
              return <WeatherCard isFav={isFav} item={item} cityPress={() => handleCityPress(item)} favClick={() => toggleFavorite(item)}/>}}
        />
      </View>
  );
};

