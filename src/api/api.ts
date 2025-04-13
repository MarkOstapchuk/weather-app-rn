import {GeoCity, CityInfo, CurrentWeather, ForecastResponse, Geoname, OverpassElement} from "../types/api-types";
import axios from "axios";
import { OPEN_WEATHER_API_KEY as API } from "@env";
import { Region } from "react-native-maps";

export const getCitiesFromGeonames = async (
  region: Region
): Promise<GeoCity[]> => {
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

export const getCitiesFromRegion = async (
  region: Region
): Promise<CityInfo[]> => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const minLat = latitude - latitudeDelta / 2;
  const maxLat = latitude + latitudeDelta / 2;
  const minLon = longitude - longitudeDelta / 2;
  const maxLon = longitude + longitudeDelta / 2;

  const query = `
    [out:json];
    (
      node["place"~"city"]["population"](${minLat},${minLon},${maxLat},${maxLon});
    );
    out;
  `;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      new URLSearchParams({ data: query }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const elements: OverpassElement[] = response.data.elements;
    const topCities = elements
      .filter((el) => {
        const pop = parseInt(el.tags?.population || "");
        return el.tags?.name && !isNaN(pop) && pop > 10000;
      })
      .sort((a, b) => {
        const popA = parseInt(a.tags?.population || "0");
        const popB = parseInt(b.tags?.population || "0");
        return popB - popA;
      })
      .slice(0, 10)
      .map((el) => ({
        city: el.tags!.name!,
        latitude: el.lat,
        longitude: el.lon
      }));
    console.log("Города в регионе:", elements);

    return topCities;
  } catch (error) {
    console.error("Ошибка при получении городов:", error);
    return [];
  }
};
export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<CurrentWeather> => {
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
