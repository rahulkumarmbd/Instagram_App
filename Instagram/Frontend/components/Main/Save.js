import { useState } from "react";
import { Text, View, Image, TextInput, Button, StyleSheet } from "react-native";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, storage } from "../../firebase/config";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Fetch_Current_User } from "../../redux/User/Actions";

export const Save = ({ route, navigation }) => {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState("");
  const CurrentUser = useSelector((store) => store.User.CurrentUser);
  const dispatch = useDispatch();

  const { image, type } = route.params;

  const uploadImage = async () => {
    if (!image) return;

    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef =
      type === "Post"
        ? ref(storage, `posts/${uuid()}`)
        : type === "ProfilePicture"
        ? ref(storage, `users/${auth.currentUser.uid}`)
        : ref(storage, `stories/${auth.currentUser.uid}`);
    // uploadBytes(imageRef, blob).then(() => {
    //   alert("Image uploaded successfully");
    // });

    const uploadTask = uploadBytesResumable(imageRef, blob);

    const progressFun = (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress("Upload is " + Math.floor(progress) + "% done");

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    };

    const errorFun = (error) => {
      console.log(error);
    };

    const successFun = () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        type === "Post"
          ? uploadPost(downloadURL)
          : type === "ProfilePicture"
          ? uploadProfilePicture(downloadURL)
          : uploadStory(downloadURL);
      });
    };

    uploadTask.on("state_changed", progressFun, errorFun, successFun);
  };

  const uploadStory = (downloadURL) => {
    const id = uuid();
    setDoc(doc(db, "stories", CurrentUser.id, "userStories", id), {
      story_id: id,
      timestamp: new Date().toISOString(),
      story_image: downloadURL,
      userId: CurrentUser.id,
    })
      .then((res) => {
        alert("success!");
        navigation.goBack();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const uploadPost = (downloadURL) => {
    const id = uuid();
    setDoc(doc(db, "posts", CurrentUser.id, "userPosts", id), {
      id,
      timestamp: new Date(),
      url: downloadURL,
      caption,
    })
      .then((res) => {
        alert("success!");
        navigation.popToTop();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const uploadProfilePicture = (downloadURL) => {
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      profilePic: downloadURL,
    })
      .then((res) => {
        alert("success!");
        dispatch(Fetch_Current_User());
        navigation.goBack();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <View>
      <Text>Save Screen</Text>
      {type === "Post" ? (
        <TextInput
          placeholder="Enter a Caption"
          onChangeText={(text) => setCaption(text)}
        />
      ) : null}
      <Image source={{ uri: image }} style={styles.logo} />
      <Button onPress={() => uploadImage()} title="Upload" />
      <View style={styles.processBar}>
        <Text>{progress}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  processBar: {
    marginTop: 20,
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "65%",
    marginTop: 10,
    marginBottom: 10,
  },
});
