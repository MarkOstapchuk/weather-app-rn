import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FeaturesStackParamList } from "../../types/navigation-types.ts";
import Ionicons from "react-native-vector-icons/Ionicons";

const FeaturesScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<FeaturesStackParamList>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.horoscopeCard}
        onPress={() => navigation.navigate("Horoscope")}>
        <Image
          style={styles.horoscopeIcon}
          source={require("../../assets/icons/horoscope.png")}
        />
        <Text style={styles.cardText}>Гороскоп</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.horoscopeCard}
        onPress={() => navigation.navigate("AnimalActivity")}>
        <Ionicons name={"paw-outline"} size={30}/>
        <Text style={styles.cardText}>Активность животных</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.horoscopeCard}
          onPress={() => navigation.navigate("Music")}>
        <Ionicons name={"radio-outline"} size={30}/>
        <Text style={styles.cardText}>Плейлист по погоде</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  horoscopeCard: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 20
  },
  horoscopeIcon: {
    width: 30,
    height: 30
  },
  cardText: {
    fontSize: 20,
    lineHeight: 30
  }
});

export { FeaturesScreen };
