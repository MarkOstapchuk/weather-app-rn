import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getHoroscopeData } from "../../api/horoscope.ts";
import { StackNavigationProp } from "@react-navigation/stack";
import { FeaturesStackParamList } from "../../types/navigation-types.ts";
import { zodiacIcons } from "../../assets/icons/zodiacs";

type HoroscopeItem = {
  sign: string;
  message: string;
};

export const HoroscopeListScreen = () => {
  const [data, setData] = useState<HoroscopeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<StackNavigationProp<FeaturesStackParamList>>();

  const fetchHoroscopeData = async () => {
    try {
      const response = await getHoroscopeData();
      const result: HoroscopeItem[] = Object.entries(response).map(
        ([sign, message]) => ({
          sign,
          message: message as string
        })
      );
      setData(result);
    } catch (error) {
      console.log(error);
      Alert.alert("Ошибка", "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscopeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка гороскопов...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.sign}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("HoroscopeDetails", {
                sign: item.sign,
                message: item.message
              })
            }>
            <Text style={styles.title}>{item.sign}</Text>
            <Image
              source={zodiacIcons[item.sign as keyof typeof zodiacIcons]}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2"
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "600"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
