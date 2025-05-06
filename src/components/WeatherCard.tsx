import React from "react";
import { StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CityItem} from "../types/api-types";
import { AppColors } from "../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CityItemProps {
  isFav: boolean;
  favClick: (item: CityItem) => void;
  item: CityItem;
  cityPress: () => void;
}

export const WeatherCard: React.FC<CityItemProps> = ({ isFav, favClick, cityPress, item }) => {
  return (
      <View style={styles.resultItem}>
        <TouchableOpacity
            onPress={cityPress}
            style={{ flex: 1 }}
        >
          <Text style={styles.resultText}>
            {item.name}, {item.state ? `${item.state}, ` : ""}
            {item.country}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => favClick(item)}>
          <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={22}
              color={isFav ? "tomato" : AppColors.mediumGray}
          />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  resultText: {
    fontSize: 16,
    color: "#333"
  }
});
