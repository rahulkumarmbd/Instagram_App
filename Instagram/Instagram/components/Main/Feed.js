import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";

export const Feed = () => {
  const [displayPosts, setDisplayPosts] = useState([]);
  const { User, FollowingData } = useSelector((store) => store);
  const { UsersCount, Users } = FollowingData;
  const { followings, posts, CurrentUser } = User;

  useEffect(() => {
    let allPosts = [...posts];
    if (UsersCount === followings.length) {
      Users.forEach((user) => {
        allPosts = [...allPosts, ...user.posts];
      });
      setDisplayPosts(allPosts.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [UsersCount, posts]);

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View>
        <Text>Feed</Text>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={displayPosts}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <View style={styles.imageContainer}>
                <Text>
                  {item.user?.name ? item.user.name : CurrentUser.name}
                </Text>
                <Image style={styles.image} source={{ uri: item.url }} />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
});
