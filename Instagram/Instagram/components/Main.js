import { useEffect } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Fetch_Current_User,
  Fetch_Current_User_Following,
  Fetch_Current_User_Posts,
} from "../redux/User/Actions";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Feed } from "./Main/Feed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Add } from "./Main/Add";
import { Profile } from "./Main/Profile";
import { SafeAreaViewHelper } from "./utils/SafeAreaViewHelper";
import { Search } from "./Main/Search";

const Tab = createMaterialBottomTabNavigator();

export const Main = ({ userId }) => {
  const dispatch = useDispatch();
  const CurrentUser = useSelector((store) => store.User.CurrentUser);

  useEffect(() => {
    dispatch(Fetch_Current_User(userId));
    dispatch(Fetch_Current_User_Posts(userId));
    dispatch(Fetch_Current_User_Following(userId));
  }, []);

  if (!CurrentUser)
    return (
      <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
        <View>
          <Text>Loading....</Text>
        </View>
      </SafeAreaView>
    );

  return (
    <Tab.Navigator initialRouteName="Feed" labeled={true}>
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
