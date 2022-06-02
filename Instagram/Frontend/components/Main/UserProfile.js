import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { Profile } from "./Profile";

export const UserProfile = ({ route }) => {
  const [posts, setPosts] = useState(null);
  const user = route.params;

  useEffect(() => {
    getDocs(
      query(
        collection(db, `posts/${user.id}/userPosts`),
        orderBy("timestamp", "desc")
      )
    )
      .then((res) => {
        const data = res.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <Profile userPosts={posts} user={user} />;
};
