import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { set, ref, getDatabase, get, push, onValue } from "firebase/database";
import { v4 as uuid } from "uuid";
import { auth } from "../../firebase/config";
import { useSelector } from "react-redux";

export const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { CurrentUser } = useSelector((store) => store.User);
  const [roomId, setRoomId] = useState("");
  const database = getDatabase();
  const ChatRoom = route.params.data;

  useEffect(() => {
    if (ChatRoom.roomId) {
      setRoomId(ChatRoom.roomId);
      return getConversation(ChatRoom.roomId);
    }
    getChatRoom(ChatRoom);
  }, []);

  const getChatRoom = (chatRoom) => {
    get(ref(database, `chats`)).then((res) => {
      const chats = res.val();
      for (let key in chats) {
        if (chats == null) break;
        if (
          (chatRoom[0].id === chats[key].members[0].id &&
            chatRoom[1].id === chats[key].members[1].id) ||
          (chatRoom[0].id === chats[key].members[1].id &&
            chatRoom[1].id === chats[key].members[0].id)
        ) {
          setRoomId(String(key));
          return getConversation(key);
        }
      }

      chatRoom.push(new Date().toISOString());
      let id = uuid();

      set(ref(database, "chats/" + id + "/members"), chatRoom).then(() => {
        console.log("chat room created");
        getConversation(id);
      });
      setRoomId(String(id));
    });
  };

  const getConversation = (roomId) => {
    onValue(ref(database, "chats/" + roomId + "/conversation"), (snapshot) => {
      let conversation = [];
      const data = snapshot.val();
      for (let firebaseId in data) {
        conversation.push(data[firebaseId]);
      }
      setMessages(() =>
        GiftedChat.append(
          [],
          conversation.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        )
      );
    });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            size={32}
            color={"#2e64e5"}
            style={{ marginRight: 5, marginBottom: 5 }}
          />
        </View>
      </Send>
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  const onSend = useCallback(
    (messages = []) => {
      if (!messages.length) return;
      messages[0].user.name = CurrentUser.name;
      messages[0].user.avatar = CurrentUser.profilePic;
      messages[0].timestamp = new Date().toISOString();

      set(
        push(ref(database, "chats/" + roomId + "/conversation")),
        messages[0]
      ).then((res) => {
        console.log("saved");
      });
    },
    [roomId]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
      }}
      alwaysShowSend
      renderBubble={renderBubble}
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      placeholder="Type a message..."
    />
  );
};
