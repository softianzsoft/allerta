import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Text, TextInput } from "components";
import { Colors } from "style";

import navigationOptions from "./ForgetPwdScreen.navigationOptions";
import styles from "./ForgetPwdScreen.styles";
import { lostPWD } from "webservice/Login";

const ForgetPwdScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const sendRequest = async () => {
    setLoading(true);
    await lostPWD(email).then(async (response) => {
      if (response.respond === 0) {
        Alert.alert(t("PROMPT_FAIL_HEADER"), response.message, [{ text: t("OK_PROMPT_BTN"), onPress: () => setLoading(false) }]);
      } else {
        Alert.alert(t("PROMPT_SUCCESS_HEADER"), t("FORGET_PWD_SUCCESS_MSG"), [{ text: t("OK_PROMPT_BTN"), onPress: () => setLoading(false) }]);
      }
    });
  };

  const emailEntry = (text) => {
    setEmail(text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <Spinner
          visible={loading}
          textContent={""}
        />
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
          <Text.Header style={styles.headerTtle}>{t("FORGET_PWD_FORM_TITLE")}</Text.Header>
          <Text.Primary style={styles.headerDesc}>
            {t("FORGET_PWD_FORM_MSG")}
          </Text.Primary>
        </View>
        <Text.Primary style={styles.inputTitle}>{t("FORGET_PWD_EMAIL_INPT")}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("FORGET_PWD_EMAIL_HINT")}
            isOptional={false}
            onchange={(txt) => emailEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"emailAddress"}
            keyboardType={"email-address"}
          />
        </View>
        <TouchableOpacity style={{ marginBottom: 25 }} onPress={() => sendRequest()}>
          <Text.Primary style={styles.mainBtn}>{t("FORGET_PWD_SBT_BTN")}</Text.Primary>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

ForgetPwdScreen.navigationOptions = navigationOptions();

export default ForgetPwdScreen;
