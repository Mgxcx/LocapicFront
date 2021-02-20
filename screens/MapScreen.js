import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Button, Overlay, Input } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketIOClient from "socket.io-client";

import { connect } from "react-redux";

var socket = socketIOClient("http://192.168.1.12:3000");

function MapScreen({ pseudo }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("Loading...");
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [titlePOI, setTitlePOI] = useState("");
  const [descriptionPOI, setDescriptionPOI] = useState("");
  const [currentPOI, setCurrentPOI] = useState();
  const [listLocation, setListLocation] = useState([]);

  useEffect(() => {
    const getPermissionsForPosition = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      Location.watchPositionAsync({ distanceInterval: 1 }, (location) => {
        setLocation(location);
        socket.emit("sendLocation", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          pseudo: pseudo,
        });
      });
    };

    getPermissionsForPosition();

    const getListPOIInStorage = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("POI");
        return jsonValue != null && setListPOI(JSON.parse(jsonValue));
      } catch (error) {
        console.log(error);
      }
    };

    getListPOIInStorage();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("POI", JSON.stringify(listPOI));
  }, [listPOI]);

  useEffect(() => {
    socket.on("sendLocationToAll", (locationData) => {
      var newListLocation = [...listLocation];
      newListLocation = newListLocation.filter((location) => location.pseudo != locationData.pseudo);
      newListLocation.push(locationData);
      setListLocation(newListLocation);
    });
  }, [listLocation]);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  if (!location) {
    return (
      <View style={styles.containerError}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containermap}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(location) => {
            if (addPOI) {
              setCurrentPOI(location.nativeEvent.coordinate);
              toggleOverlay();
            }
          }}
        >
          <View>
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>
              <View>
                <Input
                  placeholder="titre"
                  style={styles.input}
                  onChangeText={(val) => setTitlePOI(val)}
                  value={titlePOI}
                />
                <Input
                  placeholder="description"
                  style={styles.input}
                  onChangeText={(val) => setDescriptionPOI(val)}
                  value={descriptionPOI}
                />
                <Button
                  title="Ajouter POI"
                  buttonStyle={styles.poibutton}
                  onPress={() => {
                    setOverlayVisible(false);
                    setListPOI([...listPOI, { ...currentPOI, title: titlePOI, description: descriptionPOI }]);
                    setAddPOI(false);
                    setTitlePOI("");
                    setDescriptionPOI("");
                  }}
                />
              </View>
            </Overlay>
          </View>
          {listLocation.map((location, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.pseudo}
              description="I'm here"
              pinColor="green"
            />
          ))}
          {listPOI.map((location, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.title}
              description={location.description}
              pinColor="blue"
            />
          ))}
        </MapView>
      </View>

      <View style={styles.containerbutton}>
        <Button
          icon={<FontAwesome name="map-marker" size={24} color="white" />}
          title="Add POI"
          onPress={() => setAddPOI(true)}
          buttonStyle={styles.poibutton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerError: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  containermap: {
    height: "80%",
  },
  containerbutton: {
    height: "20%",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  overlay: {
    width: "80%",
    height: "75%",
  },
  poibutton: {
    backgroundColor: "#eb4d4b",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

function mapStateToProps(state) {
  return { pseudo: state.pseudo };
}

export default connect(mapStateToProps, null)(MapScreen);
