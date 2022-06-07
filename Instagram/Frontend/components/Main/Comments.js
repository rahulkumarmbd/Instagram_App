import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { v4 as uuid } from "uuid";
import { Fetch_Following_User } from "../../redux/FollowingUser/Actions";

export const Comments = ({ route }) => {
  const { CurrentUser } = useSelector((store) => store.User);
  const { Users } = useSelector((store) => store.FollowingData);
  const [newComment, setNewComment] = useState("");
  const [postID, setPostID] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { postId, userId } = route.params;

  useEffect(() => {
    if (postID !== postId) {
      onSnapshot(
        query(
          collection(db, `posts/${userId}/userPosts/${postId}/comments`),
          orderBy("timestamp", "desc")
        ),
        (res) => {
          const comments = res.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          const done = comments.some((ele) => ele.timestamp === null);
          if (done) return;
          addUserDetailsToComment(comments);
          if (loading) {
            setLoading(false);
          }
          if (postId !== postID) {
            setPostID(postId);
          }
        }
      );
    } else {
      console.log("updated");
      addUserDetailsToComment(comments);
    }
  }, [postId, Users]);

  const addUserDetailsToComment = (comments) => {
    let ids = [];
    comments.forEach((comment) => {
      if (comment.hasOwnProperty("user")) return;

      let user = Users.find((ele) => ele.id === comment.creator);
      if (!user && !ids.includes(comment.creator)) {
        ids.push(comment.creator);
        return dispatch(Fetch_Following_User(comment.creator, false, Users));
      }

      if (!user) return;

      if (user.hasOwnProperty("posts")) {
        let { posts, ...rest } = user;
        comment.user = rest;
        return;
      }
      comment.user = user;
      return;
    });
    setComments([...comments]);
  };

  const addNewComment = () => {
    if (!newComment) return alert("Comment can't be empty");
    if (!postId || !userId) return alert("Invalid Opeation");
    setUploading(true);
    const id = uuid();
    setDoc(doc(db, "posts", userId, "userPosts", postId, "comments", id), {
      id,
      creator: CurrentUser.id,
      timestamp: new Date(),
      comment: newComment,
    })
      .then((res) => {
        console.log("success");
        setUploading(false);
        setNewComment("");
      })
      .catch((err) => {
        alert("something went wrong");
      });
  };

  if (loading) {
    return (
      <View>
        <Text>Loading.....</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Comments</Text>
      {uploading ? (
        <View>
          <Text>Loading.....</Text>
        </View>
      ) : (
        <View></View>
      )}
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>User: {item.user?.name}</Text>
              <Text>Comment: {item.comment}</Text>
            </View>
          );
        }}
      />
      <TextInput
        placeholder="Enter your comment...."
        onChangeText={(text) => setNewComment(text)}
        autoFocus={true}
        value={newComment}
      />
      <Button title="Post" onPress={addNewComment} />
    </View>
  );
};
