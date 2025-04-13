import { useMemo } from "react";
import { Forecast } from "../types/api-types";

interface ProcessedForecast {
  minTemp: number;
  maxTemp: number;
  mostFrequentMain: string;
  mostFrequentDescription: string;
}

const useForecastData = (forecasts: Forecast[]): ProcessedForecast => {
  return useMemo(() => {
    if (!forecasts.length) {
      return {
        minTemp: 0,
        maxTemp: 0,
        mostFrequentMain: "",
        mostFrequentDescription: ""
      };
    }

    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;
    const mainFrequency: Record<string, number> = {};
    const descriptionFrequency: Record<string, number> = {};

    forecasts.forEach((forecast) => {
      minTemp = Math.min(minTemp, forecast.main.temp_min);
      maxTemp = Math.max(maxTemp, forecast.main.temp_max);

      forecast.weather.forEach((weather) => {
        mainFrequency[weather.main] = (mainFrequency[weather.main] || 0) + 1;
        descriptionFrequency[weather.description] =
          (descriptionFrequency[weather.description] || 0) + 1;
      });
    });

    minTemp = Math.round(minTemp);
    maxTemp = Math.round(maxTemp);

    const mostFrequentMain = Object.keys(mainFrequency).reduce((prev, curr) =>
      mainFrequency[curr] > mainFrequency[prev] ? curr : prev
    );

    const mostFrequentDescription = Object.keys(descriptionFrequency).reduce(
      (prev, curr) =>
        descriptionFrequency[curr] > descriptionFrequency[prev] ? curr : prev
    );

    return { minTemp, maxTemp, mostFrequentMain, mostFrequentDescription };
  }, [forecasts]);
};

export default useForecastData;
