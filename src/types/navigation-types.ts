export type RootTabParamList = {
  Map: undefined;
  Search: undefined;
  Main: undefined;
  Features: undefined;
};

export type MainStackParamList = {
  Main: undefined;
  Favorites: undefined;
  Forecast: {
    lat: number,
    lon: number
  }
};
export type FeaturesStackParamList = {
  Features: undefined;
  Horoscope: undefined;
  HoroscopeDetails: {
    sign: string,
    message: string
  };
  Music: undefined;
  AnimalActivity: undefined
}