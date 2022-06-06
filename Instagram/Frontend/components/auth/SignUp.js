import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const initialState = {
  name: "",
  email: "",
  password: "",
};

// console.log(auth.createUserWithEmailAndPassword);

export const SignUp = () => {
  const [userCredentials, setUserCredentials] = useState(initialState);
  const auth = getAuth();
  const colRef = collection(db, "users");

  const handleSignUp = () => {
    const { email, password } = userCredentials;
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        setDoc(doc(db, "users", user.uid), {
          ...userCredentials,
          id: user.uid,
          profilePic: "https://chingizpro.github.io/portfolio/img/person.png",
        })
          .then((res) => {
            console.log("success");
          })
          .catch((err) => {
            alert("something went wrong");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDocs(colRef).then((snapshot) => {
      const users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      // console.log(users);
    });
  }, []);

  return (
    <View>
      <Text>SignUp</Text>
      <TextInput
        placeholder="Name"
        onChangeText={(name) =>
          setUserCredentials({ ...userCredentials, name })
        }
        value={userCredentials.name}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(email) =>
          setUserCredentials({ ...userCredentials, email })
        }
        value={userCredentials.email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(password) =>
          setUserCredentials({ ...userCredentials, password })
        }
        secureTextEntry={true}
        value={userCredentials.password}
      />
      <Button title="SignUp" onPress={handleSignUp} />
    </View>
  );
};
