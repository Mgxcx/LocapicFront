import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ListItem, Input, Button } from "react-native-elements";
import socketIOClient from "socket.io-client";

import { connect } from "react-redux";

var socket = socketIOClient("http://192.168.1.17:3000");

function ChatScreen({ pseudo }) {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    socket.on("sendMessageToAll", (messageData) => {
      console.log("message received", messageData);
      var str = messageData.currentMessage;
      var myRegexSmile = /:\)/g;
      var myRegexDisappointed = /:\(/g;
      var myRegexYum = /:P/g;
      var myRegexKiss = /:\*/g;
      var myRegexRage = /:@/g;
      var myRegexFuck = /fuck[a-z]*/gi;
      var newStr = str
        .replace(myRegexSmile, "\uD83D\uDE04")
        .replace(myRegexDisappointed, "\uD83D\uDE1E")
        .replace(myRegexYum, "\uD83D\uDE0B")
        .replace(myRegexKiss, "\uD83D\uDE18")
        .replace(myRegexRage, "\uD83D\uDE21")
        .replace(myRegexFuck, "\u2022\u2022\u2022");
      console.log("newStr", newStr);
      setListMessage([...listMessage, { currentMessage: newStr, pseudo: messageData.pseudo }]);
    });
  }, [listMessage]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.list}>
            <ScrollView>
              {listMessage.map((message, i) => (
                <ListItem key={i} bottomDivider>
                  <ListItem.Content>
                    <ListItem.Title>{message.currentMessage}</ListItem.Title>
                    <ListItem.Subtitle>{message.pseudo}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              ))}
            </ScrollView>
          </View>

          <View style={styles.containerinputandbutton}>
            <Input placeholder="Your message" onChangeText={(val) => setCurrentMessage(val)} value={currentMessage} />
            <Button
              icon={<FontAwesome5 name="envelope" size={24} color="white" />}
              title="Send"
              onPress={() => {
                socket.emit("sendMessage", { currentMessage, pseudo: pseudo });
                setCurrentMessage("");
              }}
              buttonStyle={styles.sendbutton}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
  },
  sendbutton: {
    backgroundColor: "#eb4d4b",
  },
  containerinputandbutton: {
    height: "20%",
    justifyContent: "flex-end",
  },
  list: {
    height: "80%",
    justifyContent: "flex-start",
  },
});

function mapStateToProps(state) {
  return { pseudo: state.pseudo };
}

export default connect(mapStateToProps, null)(ChatScreen);
