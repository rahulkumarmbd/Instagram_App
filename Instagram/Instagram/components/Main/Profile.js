import { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";

export const Profile = () => {
  const { CurrentUser, posts } = useSelector((store) => store);

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View style={styles.profileContainer}>
        <Text>Name: {CurrentUser.name}</Text>
        <Text>email: {CurrentUser.email}</Text>
      </View>
      <View style={styles.postsHeading}>
        <Text>Posts</Text>
      </View>
      <View style={styles.galleryContainer}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.url }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    borderWidth: 2,
    padding: 8,
  },
  postsHeading: {
    padding: 5,
  },
  imageContainer: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  galleryContainer: {
    flex: 1,
  },
});
