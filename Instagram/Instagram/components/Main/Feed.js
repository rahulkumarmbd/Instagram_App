import { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";

export const Feed = () => {
  useEffect(() => {
    console.log("feed");
  }, []);

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View>
        <Text>Feed</Text>
      </View>
    </SafeAreaView>
  );
};
