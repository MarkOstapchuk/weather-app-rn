import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import BottomTabsNavigator from "./src/navigation/BottomTabsNavigator";

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <BottomTabsNavigator />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
