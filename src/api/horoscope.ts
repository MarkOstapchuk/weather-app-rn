import axios from "axios";

export const getHoroscopeData = async () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const result = await axios.get("http://localhost:5000", {
    params: {
      date: formattedDate
    }
  });
  return result.data
};
