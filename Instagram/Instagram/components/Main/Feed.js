import { useNavigation } from "@react-navigation/native";
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
  const { UsersFollowingCount, Users } = FollowingData;
  const { followings, posts, CurrentUser } = User;
  const navigation = useNavigation();

  useEffect(() => {
    let allPosts = [...posts];
    if (UsersFollowingCount === followings.length) {
      Users.forEach((user) => {
        // console.log("user.posts", user?.posts);
        if (!user.posts) return;
        allPosts = [...allPosts, ...user.posts];
      });
      setDisplayPosts(allPosts.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [UsersFollowingCount, posts]);

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View>
        <Text>Feed</Text>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={displayPosts}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageContainer}>
                <Text style={styles.margin}>
                  User: {item.user?.name ? item.user.name : CurrentUser.name}
                </Text>
                <Text style={styles.margin}>Caption: {item.caption}</Text>
                <Image style={styles.image} source={{ uri: item.url }} />
                <View style={styles.margin}>
                  <Text
                    onPress={() =>
                      navigation.navigate("Comments", {
                        postId: item.id,
                        userId: item.user?.id || CurrentUser.id,
                      })
                    }
                  >
                    View Comments.....
                  </Text>
                </View>
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
  margin: {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 5,
  },
});
