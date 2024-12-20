import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ToggleSwitch from "toggle-switch-react-native";

import { Text } from "components";
import { Colors } from "style";
import { t } from "utils";

import styles from "./CustomizeByCategoriesScreen.styles";

interface Props {
  categories: any;
  selections: any;
  close: (state) => void;
}

const CustomizeByCategoriesScreen: React.FC<Props> = ({ close, categories, selections }) => {
  const [catStates, setCatStates] = useState([]);

  useEffect(() => {
    const states = [];
    selections.forEach((state) => {
      states.push(state);
    });
    setCatStates(states);
  }, []);

  const saveChanges = () => {
    close(catStates);
  };

  const setCatToggle = (key, state) => {
    const states = [];
    categories.forEach((category, index) => {
      if (key === index) {
        states.push(state);
      } else {
        states.push(catStates[index]);
      }
    });
    setCatStates(states);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text.Header style={styles.headerTtle}>{t("SUBS_CHOOSE_CATEGORIES_HEAD")}</Text.Header>
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
          {categories.map((category, index) => (
            <View style={styles.settingSwitch} key={category.id}>
              <Text.Primary style={styles.newScreenBtn}>{category.name}</Text.Primary>
              <ToggleSwitch
                isOn={catStates[index]}
                onColor={Colors.green}
                offColor={Colors.inactive}
                size="default"
                onToggle={(state) => {
                  setCatToggle(index, state);
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

export default CustomizeByCategoriesScreen;
