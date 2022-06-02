import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";

export const LandingScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", textAlign: "center" }}>
      <View style={styles.heading}>
        <Text>Instagram</Text>
      </View>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    alignItems: "center",
    padding: 20,
  },
});
