import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { t } from "utils";
import * as Updates from "expo-updates";

import { Text } from "components";
import { Colors } from "style";

import styles from "./ChooseLangScreen.styles";
import { getSettings, saveSettings } from "webservice/DB";

interface Props {
  savedLang: string;
  langList: any;
  close: () => void;
}

const ChooseLangScreen: React.FC<Props> = ({ close, langList, savedLang }) => {
  const langs = langList;
  const [defLang, setDefLang] = useState(savedLang);

  useEffect(() => {
    loadDefLang();
  }, []);

  const loadDefLang = async () => {
    const userLang = await getSettings("lang", "en");
    setDefLang(userLang);
  };

  const saveChanges = async () => {
    await saveSettings("lang", defLang);
    await Updates.reloadAsync();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text.Header style={styles.headerTtle}>{t("SETTINGS_LANGAUGE")}</Text.Header>
          <TouchableOpacity style={styles.back_btn}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => close()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.receiveOn}>
          {langs.map((lang, index) => (
            <TouchableOpacity onPress={() => setDefLang(lang.code)} key={index}>
              <View style={styles.settingSwitch}>
                <Text.Primary style={styles.newScreenBtn}>{lang.name}</Text.Primary>
                {lang.code === defLang ? <Ionicons name="checkmark-sharp" size={24} color="green" style={styles.switch} /> : <></> }
              </View>
            </TouchableOpacity>
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

export default ChooseLangScreen;
