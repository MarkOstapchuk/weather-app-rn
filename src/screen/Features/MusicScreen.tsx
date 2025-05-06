import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWeatherByCoordinates } from "../../api/api.ts";
import { getSpotifyPlaylist } from "../../api/spotify.ts";
import { useFocusEffect } from "@react-navigation/native";
import { SpotifyPlaylist } from "../../types/spotify-types.ts";

const WeatherPlaylistScreen = () => {
  const [weather, setWeather] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    fetchData();
  });
  const fetchData = async () => {
    try {
      const selectedItem = await AsyncStorage.getItem("SELECTED_CITY");
      if (!selectedItem) throw new Error("No location selected");

      const { lat, lon } = JSON.parse(selectedItem);

      const weatherRes = await fetchWeatherByCoordinates(lat, lon);

      const weatherMain = weatherRes.weather[0].main.toLowerCase();
      setWeather(weatherMain);

      const mood = mapWeatherToMood(weatherMain);

      const spotifyRes = await getSpotifyPlaylist(mood);
      const validPlaylists = spotifyRes.playlists.items.filter(
        (item) => item !== null
      );
      setPlaylists(validPlaylists);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapWeatherToMood = (weatherType: string) => {
    switch (weatherType) {
      case "clear":
        return "chill";
      case "clouds":
        return "lo-fi";
      case "rain":
        return "rainy day";
      case "snow":
        return "acoustic";
      case "thunderstorm":
        return "dark ambient";
      default:
        return "indie";
    }
  };

  const openPlaylist = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.warn("Ошибка при открытии ссылки:", err);
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка погоды и Spotify...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Погода: {weather}</Text>
      <Text style={styles.subHeader}>Spotify плейлисты:</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openPlaylist(item.external_urls.spotify)}>
            <View style={styles.playlist}>
              <Image
                source={{ uri: item.images[0]?.url }}
                style={styles.image}
              />
              <Text style={styles.title}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subHeader: { fontSize: 18, marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  playlist: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    padding: 10
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, flexShrink: 1 }
});

export default WeatherPlaylistScreen;
