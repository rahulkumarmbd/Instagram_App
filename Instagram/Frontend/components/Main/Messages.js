import { useNavigation } from "@react-navigation/native";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { format, render, cancel, register } from "timeago.js";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth } from "../../firebase/config";

export const Messages = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const stateValues = (chats, roomId) => {
      let lastMessage;
      let time;
      if (chats[roomId].conversation) {
        let chat = chats[roomId].conversation;
        const lastMessageObj =
          chat[Object.keys(chat)[Object.keys(chat).length - 1]];
        lastMessage = lastMessageObj.text;
        time = lastMessageObj.timestamp;
      } else {
        lastMessage = "Start your conversation";
        time = chats[roomId].members[2];
      }
      return { lastMessage, time };
    };

    onValue(ref(database, `chats`), (res) => {
      const chats = res.val();
      const list = [];
      for (let roomId in chats) {
        if (chats[roomId].members[0].id === auth.currentUser.uid) {
          const { lastMessage, time } = stateValues(chats, roomId);
          list.push({
            roomId,
            user: chats[roomId].members[1],
            lastMessage,
            time,
          });
          continue;
        }
        if (chats[roomId].members[1].id === auth.currentUser.uid) {
          const { lastMessage, time } = stateValues(chats, roomId);
          list.push({
            roomId,
            user: chats[roomId].members[0],
            lastMessage,
            time,
          });
        }
      }
      setChatList([
        ...list.sort((a, b) => new Date(b.time) - new Date(a.time)),
      ]);
    });
  }, []);

  return (
    <View>
      <View>
        <FlatList
          data={chatList}
          horizontal={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.container}
                onPress={() =>
                  navigation.navigate("Chat", { data: { roomId: item.roomId } })
                }
              >
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.user.profilePic }}
                  />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.userNameContainer}>
                    <Text>{item.user.name}</Text>
                    <Text>
                      {format(
                        Date.now() -
                          (new Date() - new Date(item.time).getTime())
                      )}
                    </Text>
                  </View>
                  <View>
                    <Text>{item.lastMessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: "black",
    overflow: "hidden",
    margin: 5,
    marginBottom: 2,
    justifyContent: "center",
  },
  image: {
    aspectRatio: 1,
  },
  userNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  textContainer: {
    justifyContent: "center",
    width: "81%",
    paddingHorizontal: 5,
    borderBottomColor: "pink",
    borderBottomWidth: 2,
  },
});
