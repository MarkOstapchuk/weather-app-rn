import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Forecast } from "../types/api-types";
import { getWeatherColor } from "../utils/get-weather-color";
import { AppText } from "./AppText";
import moment from "moment";
import useForecastData from "../hooks/useForecastData";
import { AppColors } from "../constants/Colors";
import { capitalizeFirstLetter } from "../utils/capitalize-first-letter";
import { getWeatherIcon } from "../utils/get-weather-icon";

interface CityItemProps {
  weatherData: Forecast[];
}

export const WeatherCard: React.FC<CityItemProps> = ({ weatherData }) => {
  const { minTemp, maxTemp, mostFrequentMain, mostFrequentDescription } =
    useForecastData(weatherData);
  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: getWeatherColor(mostFrequentMain) }
      ]}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={getWeatherIcon(mostFrequentMain)}
            style={styles.image}
          />
        </View>
        <View>
          <AppText color={AppColors.white} fontSize={20} fontWeight={"bold"}>
            {moment.unix(weatherData[0].dt).format("dddd")}
          </AppText>
          <AppText color={AppColors.white} fontSize={18} fontWeight={"regular"}>
            {capitalizeFirstLetter(mostFrequentDescription)}
          </AppText>
        </View>
      </View>
      <View style={styles.tempContainer}>
        <AppText color={AppColors.white} fontSize={24} fontWeight={"bold"}>
          {minTemp}&#176;/{maxTemp}&#176;
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    height: Dimensions.get("window").height / 8,
    paddingHorizontal: 10,
    width: "100%",
    marginTop: "5%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%"
  },
  imageContainer: {
    width: "30%"
  },
  image: {
    resizeMode: "contain",
    height: "100%",
    width: "100%"
  },
  tempContainer: {
    justifyContent: "center",
    alignItems: "flex-end"
  }
});
