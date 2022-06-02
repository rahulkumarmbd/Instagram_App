import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { db } from "../../firebase/config";
import { SafeAreaViewHelper } from "../utils/SafeAreaViewHelper";

export const Search = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const searchUsers = async (searchText) => {
    if (!searchText) return searchUsers([]);
    const q = query(collection(db, "users"), where("name", ">=", searchText));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // console.log(users);
    setUsers(users);
  };

  return (
    <SafeAreaView style={SafeAreaViewHelper.AndroidSafeArea}>
      <View>
        <Text>Search</Text>
        <TextInput
          placeholder="Search your friends"
          onChangeText={(q) => searchUsers(q)}
        />
        <FlatList
          numColumns={1}
          horizontal={false}
          data={users}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.user}
                onPress={() => {
                  navigation.navigate("UserProfile", item);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  user: {
    padding: 10,
    backgroundColor: "skyblue",
  },
});
