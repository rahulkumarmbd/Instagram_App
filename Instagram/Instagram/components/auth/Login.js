import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const [userCredentials, setUserCredentials] = useState(initialState);
  const auth = getAuth();

  const handleSignUp = () => {
    const { email, password } = userCredentials;
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res);
        // setUserCredentials(initialState);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      <Text>Login</Text>
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
