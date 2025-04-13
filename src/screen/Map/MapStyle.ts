import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  header: {
    position: "absolute",
    top: 10,
    left: "50%",
    transform: [{ translateX: -50 }],
    textAlign: "center"
  }
});
