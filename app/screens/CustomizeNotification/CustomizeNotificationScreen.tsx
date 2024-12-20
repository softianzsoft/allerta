import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ToggleSwitch from "toggle-switch-react-native";
import { t } from "utils";

import { Text } from "components";
import { Colors } from "style";

import styles from "./CustomizeNotificationScreen.styles";

interface Props {
  channels: any;
  selections: any;
  close: (state) => void;
}

const CustomizeNotificationScreen: React.FC<Props> = ({ close, channels, selections }) => {
  const [chanStates, setChanStates] = useState([]);

  useEffect(() => {
    console.log(selections);
    const states = [];
    selections.forEach((state) => {
      states.push(state);
    });
    setChanStates(states);
  }, []);

  const saveChanges = () => {
    close(chanStates);
  };

  const setChanToggle = (key, state) => {
    const states = [];
    channels.forEach((channel, index) => {
      if (key === index) {
        states.push(state);
      } else {
        states.push(chanStates[index]);
      }
    });
    setChanStates(states);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text.Header style={styles.headerTtle}>{t("SUBS_CUSTOMIZE_NOTIFICATION_HEAD")}</Text.Header>
          <TouchableOpacity style={styles.back_btn}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => saveChanges()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.receiveOn}>
          {channels.map((channel, index) => (
            <View style={styles.settingSwitch} key={index}>
              <Text.Primary style={styles.newScreenBtn}>{channel.title}</Text.Primary>
              <ToggleSwitch
                isOn={chanStates[index]}
                onColor={Colors.green}
                offColor={Colors.inactive}
                size="default"
                onToggle={(state) => {
                  setChanToggle(index, state);
                }}
                style={styles.switch}
              />
            </View>
          ))}
        </View>
        <View>
          <TouchableOpacity onPress={() => saveChanges()}>
            <Text.Primary style={styles.mainBtn}>{t("SAVE_CHANGES_BTN")}</Text.Primary>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomizeNotificationScreen;
