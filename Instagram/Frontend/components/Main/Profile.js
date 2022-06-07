import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../firebase/config";
import {
  Clear_Users,
  Update_Following_Users_On_Unfollow,
} from "../../redux/FollowingUser/Actions";
import {
  Clear_User,
  Fetch_Current_User_Following,
} from "../../redux/User/Actions";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const Profile = ({ userPosts, user }) => {
  const { CurrentUser, posts, followings } = useSelector((store) => store.User);
  const [userProfilePosts, setUserProfilePosts] = useState();
  const [userProfileUser, setUserProfileUser] = useState();
  const [profilePic, setProfilePic] = useState(
    "https://chingizpro.github.io/portfolio/img/person.png"
  );
  const [status, setStatus] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setUserProfilePosts(userPosts);
      setUserProfileUser(user);
      if (user.profilePic) {
        setProfilePic(user.profilePic);
      }
      return;
    }
    setUserProfilePosts(posts);
    setUserProfileUser(CurrentUser);
    if (CurrentUser.profilePic) {
      setProfilePic(CurrentUser.profilePic);
    }
  }, [userPosts, posts, CurrentUser]);

  useEffect(() => {
    if (followings.indexOf(user?.id) > -1) {
      return setStatus(true);
    } else {
      return setStatus(false);
    }
  }, [followings]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(Clear_User());
        dispatch(Clear_Users());
        alert("successfully logged out");
      })
      .catch((err) => {
        alert("something went wrong");
      });
  };

  const follow = () => {
    setDoc(doc(db, "following", CurrentUser.id, "userFollowing", user.id), {})
      .then((res) => {
        console.log("follow");
        dispatch(Fetch_Current_User_Following());
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const unfollow = () => {
    deleteDoc(doc(db, "following", CurrentUser.id, "userFollowing", user.id))
      .then((res) => {
        console.log("unfollow");
        dispatch(Update_Following_Users_On_Unfollow(user.id));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View style={styles.profileContainer}>
        <View>
          <View style={styles.ProfileImageContainer}>
            <Image
              style={styles.ProfileImage}
              source={{
                uri: profilePic,
              }}
            />
          </View>
          <View style={styles.ProfileImageUploadIcon}>
            <MaterialCommunityIcons
              name="camera"
              size={28}
              onPress={() => navigation.navigate("UploadProfilePicture")}
            />
          </View>
        </View>
        <Text>Name: {userProfileUser?.name}</Text>
        <Text>email: {userProfileUser?.email}</Text>
      </View>
      <View style={styles.button}>
        {user && CurrentUser.id !== user.id ? (
          status ? (
            <Button title="Following" onPress={unfollow} />
          ) : (
            <Button title="Follow" onPress={follow} />
          )
        ) : (
          <Text></Text>
        )}
        {user && CurrentUser.id !== user.id ? (
          <Button
            title="Message"
            onPress={() =>
              navigation.navigate("Chat", {
                data: [
                  {
                    id: auth.currentUser.uid,
                    profilePic: CurrentUser.profilePic,
                    name: CurrentUser.name,
                  },
                  {
                    id: user.id,
                    profilePic: user.profilePic,
                    name: user.name,
                  },
                ],
              })
            }
          />
        ) : (
          <Text></Text>
        )}
      </View>
      <View style={styles.button}>
        {!user || CurrentUser.id === user.id ? (
          <Button title="LogOut" onPress={logout} />
        ) : (
          <Text></Text>
        )}
      </View>
      <View style={styles.postsHeading}>
        <Text>Posts</Text>
      </View>
      <View style={styles.galleryContainer}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userProfilePosts}
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
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
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
  button: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  ProfileImageContainer: {
    height: 75,
    width: 75,
    margin: 10,
    borderRadius: 37.5,
    overflow: "hidden",
  },
  ProfileImage: {
    aspectRatio: 1,
  },
  ProfileImageUploadIcon: {
    position: "absolute",
    right: 2,
    bottom: 2,
  },
});
