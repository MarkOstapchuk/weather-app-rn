export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export type WeatherData = {
  name: string;
  coord: {
    lat: number;
    lon: number;
  }
  weather: Weather[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  dt: number;
};

export interface Rain {
  "3h": number;
}
export type CityItem = {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
};
export interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Forecast {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain: Rain;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Forecast[];
  city: City;
}

export interface CurrentWeather {
  coord: { lon: number; lat: number };
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain?: Record<string, number>;
  clouds: Clouds;
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Geoname {
  lng: Number;
  geonameId: Number;
  countrycode: String;
  name: String;
  fclName: String;
  toponymName: String;
  fcodeName: String;
  wikipedia: String;
  lat: Number;
  fcl: String;
  population: Number;
  fcode: String;
}
export type GeoCity = {
  name: string;
  lat: number;
  lng: number;
  population: number;
};

export type HoroscopeItem = Record<string, string>