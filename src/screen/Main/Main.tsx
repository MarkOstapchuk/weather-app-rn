import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchWeatherByCoordinates } from "../../api/api.ts";
import { CityItem, WeatherData } from "../../types/api-types.ts";
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  MainStackParamList,
  RootTabParamList
} from "../../types/navigation-types.ts";

const MainScreen: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing] = useState(false);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const rootNavigation = useNavigation<StackNavigationProp<RootTabParamList>>();

  const getWeather = async () => {
    try {
      const selectedCity = await AsyncStorage.getItem("SELECTED_CITY");
      if (selectedCity) {
        const city: CityItem = JSON.parse(selectedCity);
        const data = await fetchWeatherByCoordinates(city.lat, city.lon);
        setWeatherData(data);
        setLoading(false);
        return;
      }
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Location permission denied");
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoordinates(latitude, longitude);
          setWeatherData(data);
          setLoading(false);
        },
        (error) => {
          console.error(error.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getWeather();
    }, [])
  );
  const currentCityPress = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Location permission denied");
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const data = await fetchWeatherByCoordinates(latitude, longitude);
        setWeatherData(data);
        setLoading(false);
        await AsyncStorage.setItem(
          "SELECTED_CITY",
          JSON.stringify({
            name: data.name,
            lat: latitude,
            lon: longitude,
            country: data.sys.country
          })
        );
      },
      (error) => {
        console.error(error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const getTimeOfDay = () => {
    if (!weatherData) return "day";
    const current = weatherData.dt;
    const { sunrise, sunset } = weatherData.sys;
    if (current < sunrise) return "night";
    if (current > sunset) return "night";
    const hour = new Date(current * 1000).getHours();
    if (hour < 11) return "morning";
    if (hour < 18) return "day";
    return "evening";
  };

  const getSuggestion = () => {
    if (!weatherData) return "";
    const temp = weatherData.main.temp;
    if (temp < 0) return "❄️ Очень холодно, оденься теплее!";
    if (temp < 10) return "🧥 Прохладно. Куртка не помешает.";
    if (temp > 30) return "🥵 Жарко! Пей больше воды.";
    return "🙂 Отличная погода!";
  };

  const themeColors = {
    morning: ["#FFDEE9", "#B5FFFC"],
    day: ["#56CCF2", "#2F80ED"],
    evening: ["#fbc2eb", "#a6c1ee"],
    night: ["#0f2027", "#203a43", "#2c5364"]
  };
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Загрузка погоды...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.loading}>
        <Text>Не удалось получить данные о погоде</Text>
      </View>
    );
  }

  const {
    name,
    weather,
    coord,
    main: { temp, feels_like, humidity, pressure },
    wind: { speed },
    clouds: { all: cloudiness },
    sys: { country, sunrise, sunset },
    visibility
  } = weatherData;
  const weatherMain = weather[0];
  const timeOfDay = getTimeOfDay();

  return (
    <LinearGradient colors={themeColors[timeOfDay]} style={{ flex: 1 }}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Ionicons name="heart-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => rootNavigation.navigate("Search")}
          style={styles.searchBar}>
          <Text style={{ color: "#fff", fontSize: 18 }}>Search</Text>
          <Ionicons name="search-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={currentCityPress}>
          <Ionicons name="navigate" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getWeather} />
        }>
        <Text style={styles.city}>
          {name}, {country}
        </Text>

        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weatherMain.icon}@4x.png`
          }}
          style={styles.weatherIcon}
        />

        <Text style={styles.temp}>{Math.round(temp)}°C</Text>
        <Text style={styles.description}>{weatherMain.description}</Text>

        <Text style={styles.suggestion}>{getSuggestion()}</Text>

        <TouchableOpacity
          style={styles.forecastButton}
          onPress={() =>
            navigation.navigate("Forecast", { lat: coord.lat, lon: coord.lon })
          }>
          <Text>Просмотреть прогноз погоды</Text>
        </TouchableOpacity>

        <View style={styles.cardGroup}>
          <Card
            icon="thermometer-outline"
            label="Ощущается"
            value={`${Math.round(feels_like)}°C`}
          />
          <Card icon="water-outline" label="Влажность" value={`${humidity}%`} />
          <Card
            icon="speedometer-outline"
            label="Давление"
            value={`${pressure} hPa`}
          />
          <Card
            icon="eye-outline"
            label="Видимость"
            value={`${visibility / 1000} км`}
          />
          <Card
            icon="cloud-outline"
            label="Облачность"
            value={`${cloudiness}%`}
          />
          <Card icon="navigate-outline" label="Ветер" value={`${speed} м/с`} />
          <Card
            icon="sunny-outline"
            label="Восход"
            value={formatTime(sunrise)}
          />
          <Card icon="moon-outline" label="Закат" value={formatTime(sunset)} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const Card: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value
}) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={22} color="#333" />
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center"
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.1)"
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  city: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10
  },
  temp: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "200",
    marginVertical: 10
  },
  description: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#fff",
    marginBottom: 10
  },
  suggestion: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20
  },
  weatherIcon: {
    width: 120,
    height: 120
  },
  forecastButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    margin: 6
  },
  cardGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 10
  },
  card: {
    width: 140,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    margin: 6
  },
  cardLabel: {
    fontSize: 14,
    color: "#333",
    marginTop: 6
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginTop: 4
  }
});

export default MainScreen;
