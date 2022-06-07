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

  const handleLogin = () => {
    const { email, password } = userCredentials;
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        alert("Email and password do not match")
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
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
