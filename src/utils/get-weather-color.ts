export function getWeatherColor(main: string): string {
  switch (main) {
    case "Clear":
      return "#58abf9";
    case "Clouds":
      return "#99b2eb";
    case "Rain":
      return "#0b83fa";
    case "Drizzle":
      return "#708090";
    case "Thunderstorm":
      return "#1d0165";
    case "Snow":
      return "#c6cacf";
    case "Mist":
    case "Fog":
    case "Haze":
    case "Dust":
    case "Ash":
    case "Sand":
    case "Squall":
    case "Tornado":
      return "#058787";
    default:
      return "#023744";
  }
}
