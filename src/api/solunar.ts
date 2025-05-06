import axios from "axios";
import {SolunarData} from "../types/solunar-types.ts";

export const getSolunarData = async (lat: string, lon: string) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}${mm}${dd}`;

  const result = await axios.get<SolunarData>(`https://api.solunar.org/solunar/${lat},${lon},${formattedDate},3`)
    return result.data
 }