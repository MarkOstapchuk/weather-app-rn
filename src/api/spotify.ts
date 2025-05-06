import axios from "axios";
import {SpotifyReturn} from "../types/spotify-types.ts";

const SPOTIFY_CLIENT_ID = "6832dcd5fc0c44889ee6d1b0de6b33c5";
const SPOTIFY_CLIENT_SECRET = "37a6da62bc7844de92e7592c2e2c793c";

const fetchSpotifyToken = async () => {
  const tokenRes = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      }
    }
  );
  return tokenRes.data.access_token;
};

export const getSpotifyPlaylist = async (mood: string) => {
  const token = await fetchSpotifyToken();
  const response = await axios.get<SpotifyReturn>(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      mood
    )}&type=playlist&limit=15`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data
};
