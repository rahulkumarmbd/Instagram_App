import InstaStory from "react-native-insta-story";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

export const InstaStories = () => {
  const { Stories, Users } = useSelector((store) => store.FollowingData);
  const [data, setData] = useState([]);

  // console.log("stories loaded", Stories);

  useEffect(() => {
    let newStories = [];
    Stories.forEach((story) => {
      const user = Users.find((ele) => ele.id === story.id);
      if(!user) return;

      newStories.push({
        user_id: story.id,
        user_image: user?.profilePic,
        user_name: user.name,
        stories: story.stories,
      });
    });

    setData(newStories);
  }, [Stories]);

  return (
    <InstaStory
      data={data}
      duration={10}
      customSwipeUpComponent={
        <View>
          <Text>swipe</Text>
        </View>
      }
      style={{ marginTop: 2 }}
    />
  );
};
