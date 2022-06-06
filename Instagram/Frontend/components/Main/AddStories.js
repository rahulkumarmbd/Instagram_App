import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";

export const AddStories = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    navigation.addListener("focus", () => {
      setImage(null);
    });
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {isFocused && (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={type}
            ratio={"1:1"}
          />
        )}
      </View>
      <Button
        style={styles.button}
        title={"Flip Camera"}
        onPress={() => {
          setType(
            type === CameraType.back ? CameraType.front : CameraType.back
          );
        }}
      ></Button>
      <Button
        style={styles.button}
        title={"Capture Image"}
        onPress={() => takePicture()}
      ></Button>
      <Button
        style={styles.button}
        title={"Pic Image"}
        onPress={() => pickImage()}
      ></Button>
      {image && (
        <Button
          style={styles.button}
          title={"Save Image"}
          onPress={() => {
            navigation.navigate("Save", { image, type: "Story" });
          }}
        ></Button>
      )}
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  name: {
    borderWidth: 10,
    position: "absolute",
    right: 100,
    bottom: 100,
  },
});
