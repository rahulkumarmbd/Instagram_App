import React from "react";
import { Button, Text, View } from "react-native";

export const LandingScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", textAlign: "center" }}>
      <Text>Hello Lading Screen</Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};
