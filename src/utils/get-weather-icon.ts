import { ImageSourcePropType } from "react-native";

export function getWeatherIcon(main: string): ImageSourcePropType {
  switch (main) {
    case "Clear":
      return require("../assets/icons/clear.png");
    case "Clouds":
      return require("../assets/icons/clouds.png");
    case "Rain":
      return require("../assets/icons/rain.png");
    case "Drizzle":
      return require("../assets/icons/drizzle.png");
    case "Thunderstorm":
      return require("../assets/icons/thunderstorm.png");
    case "Snow":
      return require("../assets/icons/snow.png");
    case "Mist":
    case "Fog":
    case "Haze":
    case "Dust":
    case "Ash":
    case "Sand":
    case "Squall":
    case "Tornado":
      return require("../assets/icons/atmosphere.png");
    default:
      return require("../assets/icons/default.png");
  }
}
