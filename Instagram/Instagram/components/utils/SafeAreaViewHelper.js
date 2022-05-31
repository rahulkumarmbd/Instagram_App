import { StyleSheet, Platform, StatusBar } from "react-native";

export const SafeAreaViewHelper = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
