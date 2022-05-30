// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, LogBox } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LandingScreen } from "./components/auth/Landing";
import { Login } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "./firebase/config";
import { db } from "./firebase/config";
import { Main } from "./components/Main";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";

// LogBox.ignoreLogs([
//   "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
// ]);

LogBox.ignoreAllLogs();

const stack = createStackNavigator();

const initStatus = {
  lodding: true,
  loggedIn: false,
};

export default function App() {
  const [{ lodding, loggedIn }, setStatus] = useState(initStatus);
  const [userId, setUserId] = useState();
  const auth = getAuth();

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
      <View>
        <Text>Lodding....</Text>
      </View>
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
            component={() => <Main userId={userId} />}
            options={{ headerShown: false }}
          />
        </stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
