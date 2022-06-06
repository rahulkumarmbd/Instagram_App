// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, LogBox } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LandingScreen } from "./components/auth/Landing";
import { Login } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "./firebase/config";
import { db, auth } from "./firebase/config";
import { database } from "./firebase/config";
import { Main } from "./components/Main";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import "react-native-gesture-handler";
import { SafeAreaViewHelper } from "./components/utils/SafeAreaViewHelper";
import { Save } from "./components/Main/Save";
import { UserProfile } from "./components/Main/UserProfile";
import { Comments } from "./components/Main/Comments";
import { Messages } from "./components/Main/Messages";
import { Chat } from "./components/Main/Chat";
import { UploadProfilePicture } from "./components/Main/UploadProfilePicture";
import { AddStories } from "./components/Main/AddStories";

// LogBox.ignoreLogs([
//   "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
// ]);

LogBox.ignoreAllLogs();

const stack = createStackNavigator();

const initStatus = {
  lodding: true,
  loggedIn: false,
};

export default function App({ navigation }) {
  const [{ lodding, loggedIn }, setStatus] = useState(initStatus);
  const [userId, setUserId] = useState();

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          return setStatus({
            lodding: false,
            loggedIn: false,
          });
        }
        setUserId(user.uid);
        return setStatus({
          lodding: false,
          loggedIn: true,
        });
      },
      (err) => {
        console.log("error", err);
      }
    );
  }, []);

  if (lodding) {
    return (
      <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
        <View>
          <Text>Lodding....</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <stack.Navigator initialRouteName="Landing">
          <stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <stack.Screen name="Login" component={Login} />
          <stack.Screen name="Register" component={SignUp} />
        </stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <stack.Navigator initialRouteName="MainScreen">
          <stack.Screen
            name="MainScreen"
            component={Main}
            options={{ headerShown: false }}
            navigation={navigation}
          />
          <stack.Screen name="Save" component={Save} navigation={navigation} />
          <stack.Screen
            name="Comments"
            component={Comments}
            navigation={navigation}
          />
          <stack.Screen
            name="UserProfile"
            component={UserProfile}
            navigation={navigation}
          />
          <stack.Screen
            name="Messages"
            component={Messages}
            navigation={navigation}
          />
          <stack.Screen name="Chat" component={Chat} />
          <stack.Screen name="UploadProfilePicture" component={UploadProfilePicture} navigation={navigation}/>
          <stack.Screen name="AddStories" component={AddStories} navigation={navigation}/>
        </stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
