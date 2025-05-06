import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import {
  fetchWeatherByCoordinates,
  getCitiesFromGeonames
} from "../../api/api";
import { WeatherData } from "../../types/api-types.ts";

export const MapScreen = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 49,
    longitude: 32,
    latitudeDelta: 5,
    longitudeDelta: 5
  });

  const loadWeather = async () => {
    try {
      const cities = await getCitiesFromGeonames(region);
      if (cities) {
        const results: (WeatherData | null)[] = await Promise.all(
          cities.map(async (city) => {
            try {
              const temp = await fetchWeatherByCoordinates(city.lat, city.lng);
              return {
                ...temp,
                main: {
                  ...temp.main,
                  temp: +temp.main.temp.toFixed(1),
                  feels_like: +temp.main.feels_like.toFixed(1)
                },
              };
            } catch {
              return null;
            }
          })
        );

        setWeatherData(results.filter((r): r is WeatherData => r !== null));
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
    }
  };
  useEffect(() => {
    loadWeather();
  }, [region]);

  return (
    <MapView
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={setRegion}>
      {weatherData &&
        weatherData.map((city, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: city.coord.lat, longitude: city.coord.lon }}
            title={city.name}
            description={`${city.main.temp}°C`}>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.5)",
                padding: 5,
                borderRadius: 8,
                borderColor: "#333",
                borderWidth: 0.5
              }}>
              <Text>{`${city.name}: ${city.main.temp}°C`}</Text>
            </View>
          </Marker>
        ))}
    </MapView>
  );
};
