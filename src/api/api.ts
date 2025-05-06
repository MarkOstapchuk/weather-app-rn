import {
  GeoCity,
  CurrentWeather,
  ForecastResponse,
  Geoname,
  WeatherData,
  CityItem
} from "../types/api-types";
import axios from "axios";
import { OPEN_WEATHER_API_KEY as API } from "@env";
import { Region } from "react-native-maps";

export const getCitiesFromGeonames = async (
  region: Region
): Promise<GeoCity[] | null> => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const north = latitude + latitudeDelta / 2;
  const south = latitude - latitudeDelta / 2;
  const east = longitude + longitudeDelta / 2;
  const west = longitude - longitudeDelta / 2;
  const urld = "api.geonames.org";
  const params = {
    north: north.toFixed(6),
    south: south.toFixed(6),
    east: east.toFixed(6),
    west: west.toFixed(6),
    maxRows: "10",
    username: "fodreks"
  };

  try {
    const url = `http://${urld}/citiesJSON?${params}`;

    const response = await axios<{ geonames: Geoname[] }>(url, {
      headers: {
        Host: "api.geonames.org",
        Accept: "application/json",
        "X-Forwarded-Host": "api.geonames.org"
      },
      params: params
    });
    if (!response.data.geonames) {
      return null;
    }
    return response.data.geonames.map((city: any) => ({
      name: city.name,
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lng),
      population: city.population
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCitiesByName = async (
  cityName: string
): Promise<CityItem[]> => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      cityName
    )}&limit=10&appid=${API}`
  );
  if (!response.ok) {
    throw new Error("Ошибка при поиске городов");
  }
  return await response.json();
};

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: API,
          units: "metric"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error receiving weather data by coordinates:", error);
    throw new Error("Could not get weather data at the coordinates");
  }
};
export const getForecast = async (lat: number, lon: number) => {
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat: lat,
          lon: lon,
          units: "metric",
          appid: API
        }
      }
    );
    return result.data
  } catch (e) {
    console.error(e);
  }
};
export const fetchWeatherByCity = async (
  city: string
): Promise<ForecastResponse> => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: city,
          appid: API,
          units: "metric"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failure to receive outdoor weather data:", error);
    throw new Error("Unable to obtain weather data outside the city");
  }
};
