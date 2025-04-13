import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppColors } from "../../constants/Colors";
import { styles } from "./SearchStyle";
import { fetchWeatherByCity } from "../../api/api";
import { ForecastResponse } from "../../types/api-types";
import { WeatherCard } from "../../components/WeatherCard";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import { RootTabParamList } from "../../types/navigation-types";
import { RouteProp, useRoute } from "@react-navigation/native";

type SearchScreenRouteProp = RouteProp<RootTabParamList, "Search">;

export const SearchScreen = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const [inputText, setInputText] = useState<string>(
    route.params?.cityName || ""
  );
  const [data, setData] = useState<null | ForecastResponse>(null);

  const handleSearch = async (city: string) => {
    if (city.trim() === "") {
      Alert.alert("Error", "Please type a city name.");
      return;
    }

    try {
      const weatherData = await fetchWeatherByCity(city);
      setData(weatherData);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    if (route.params?.cityName) {
      handleSearch(route.params.cityName);
      setInputText(route.params.cityName);
    }
  }, [route.params?.cityName]);

  const groupDataByDay = (data: ForecastResponse) => {
    const getDayFromTimestamp = (timestamp: number) => {
      return moment
        .unix(timestamp)
        .utcOffset(data.city.timezone / 60)
        .startOf("day");
    };

    const grouped = data.list.reduce((result, item) => {
      const itemDay = getDayFromTimestamp(item.dt);
      const key = itemDay.format("YYYY-MM-DD");

      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);
      return result;
    }, {} as Record<string, typeof data.list>);

    return Object.values(grouped);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type city name..."
              placeholderTextColor={AppColors.mediumGray}
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch(inputText)}>
            <Ionicons name="search" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
        </View>
        {data && (
          <FlatList
            data={groupDataByDay(data)}
            keyExtractor={(item) => item[0].dt.toString()}
            renderItem={({ item }) => <WeatherCard weatherData={item} />}
            scrollEnabled={false}
            style={styles.flatList}
          />
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};
