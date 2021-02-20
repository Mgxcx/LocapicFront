import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Input, Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect } from "react-redux";

function HomeScreen({ navigation, onSubmitPseudo }) {
  const [pseudo, setPseudo] = useState(null);
  const [pseudoInStorage, setPseudoInStorage] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("pseudo", (err, value) => {
      console.log(value);
      setPseudo(value);
      if (value != null) {
        setPseudoInStorage(true);
      }
    });
  }, []);

  return (
    <ImageBackground source={require("../assets/home2.png")} style={styles.image}>
      <View style={styles.container}>
        {pseudoInStorage ? (
          <Text style={styles.text}>Welcome Back {pseudo} !</Text>
        ) : (
          <Input
            placeholder="Write your name"
            placeholderTextColor="#84817a"
            style={styles.input}
            leftIcon={<FontAwesome name="user" size={24} color="#84817a" />}
            onChangeText={(val) => setPseudo(val)}
            value={pseudo}
          />
        )}

        <Button
          icon={<FontAwesome name="arrow-right" size={24} color="white" />}
          title="Go to Map"
          titleStyle={styles.textbutton}
          onPress={() => {
            onSubmitPseudo(pseudo);
            navigation.navigate("PagesTab");
            AsyncStorage.setItem("pseudo", pseudo);
          }}
          buttonStyle={styles.sendbutton}
        />
      </View>
    </ImageBackground>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  input: {
    width: "50%",
    color: "green",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  textbutton: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  sendbutton: {
    backgroundColor: "#84817a",
  },
});

export default connect(null, mapDispatchToProps)(HomeScreen);
