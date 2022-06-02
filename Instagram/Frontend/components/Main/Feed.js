import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { v4 as uuid } from "uuid";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";

export const Feed = () => {
  const [displayPosts, setDisplayPosts] = useState([]);
  const { User, FollowingData } = useSelector((store) => store);
  const { UsersFollowingCount, Feeds } = FollowingData;
  const { followings, posts, CurrentUser } = User;
  const navigation = useNavigation();

  // console.log(displayPosts);

  useEffect(() => {
    if (
      UsersFollowingCount === followings.length &&
      !Feeds.some((ele) => ele.CurrentUserLike === undefined)
    ) {
      setDisplayPosts([...Feeds.sort((a, b) => b.timestamp - a.timestamp)]);
    }
  }, [UsersFollowingCount, posts, Feeds]);

  const addLike = (postId, userId) => {
    const id = uuid();
    setDoc(
      doc(db, "posts", userId, "userPosts", postId, "likes", CurrentUser.id),
      {}
    ).then((res) => {
      console.log("Like added");
    });
  };

  const removeLike = (postId, userId) => {
    deleteDoc(
      doc(db, "posts", userId, "userPosts", postId, "likes", CurrentUser.id)
    ).then(() => {
      console.log("Dislike");
    });
  };

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View>
        <Text>Feed</Text>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={displayPosts}
          style={styles.padding}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageContainer}>
                <Text style={styles.margin}>
                  User: {item.user?.name ? item.user.name : CurrentUser.name}
                </Text>
                <Text style={styles.margin}>Caption: {item.caption}</Text>
                <Image style={styles.image} source={{ uri: item.url }} />
                <View style={styles.margin}>
                  {item?.CurrentUserLike ? (
                    <Button
                      title={`dislike : ${0}`}
                      onPress={() =>
                        removeLike(item.id, item.user?.id || CurrentUser.id)
                      }
                    />
                  ) : (
                    <Button
                      title={`Like : ${0}`}
                      onPress={() =>
                        addLike(item.id, item.user?.id || CurrentUser.id)
                      }
                    />
                  )}
                  <Text
                    style={{ paddingTop: 10 }}
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
    marginRight: 5,
  },
  padding: {
    marginBottom: 19,
  },
});
