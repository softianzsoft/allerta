import React, { useState} from "react";
import { ScrollView, TouchableOpacity, View, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Icon, Text, TextInput } from "components";
import { Colors } from "style";

import navigationOptions from "./SignUpScreen.navigationOptions";
import styles from "./SignUpScreen.styles";
import { appleLogin, facebookLogin, googleLogin, webRegister } from "components/SocialLogin";

const SignUpScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPasswordConfirmed] = useState("");

  const socialLogin = async (provider) => {
    setLoading(true);
    let success = false;
    switch (provider) {
      case "apple":
        success = await appleLogin();
        break;
      case "facebook":
        success = await facebookLogin();
        break;
      case "google":
        success = await googleLogin();
        break;
      case "web":
        if (password !== password2) {
          success = "Password fields are not match";
        } else {
          success = await webRegister(username, password, email);
        }
        break;
    }
    console.log("social login provider response", success);
    if (typeof success === "string") {
      Alert.alert(t("PROMPT_FAIL_HEADER"), success, [{ text: t("OK_PROMPT_BTN"), onPress: () => setLoading(false) }]);
    } else if (success) {
      setLoading(false);
      navigator.goBack();
    }
  };

  const usernameEntry = (text) => {
    setUsername(text);
  };
  const passwordEntry = (text) => {
    setPassword(text);
  };
  const password2Entry = (text) => {
    setPasswordConfirmed(text);
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
          <Text.Header style={styles.headerTtle}>{t("REGISTER_HEADER")}</Text.Header>
          <Text.Primary style={styles.headerDesc}>
            {t("REGISTER_SEC_HEADER")}
          </Text.Primary>
        </View>
        <Text.Primary style={styles.inputTitle}>{t("REGISTER_USERNAME_INPT")}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("REGISTER_USERNAME_HINT")}
            isOptional={false}
            onchange={(txt) => usernameEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"username"}
            keyboardType={"ascii-capable"}
          />
        </View>
        <Text.Primary style={styles.inputTitle}>{t("REGISTER_EMAIL_INPT")}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("REGISTER_EMAIL_HINT")}
            isOptional={false}
            onchange={(txt) => emailEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"emailAddress"}
            keyboardType={"email-address"}
          />
        </View>
        <Text.Primary style={styles.inputTitle}>{t("REGISTER_PWD_INPT")}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("REGISTER_PWD_HINT")}
            isOptional={false}
            secured={true}
            onchange={(txt) => passwordEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"password"}
          />
        </View>
        <Text.Primary style={styles.inputTitle}>{t("REGISTER_PWD2_INPT")}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("REGISTER_PWD2_HINT")}
            isOptional={false}
            secured={true}
            onchange={(txt) => password2Entry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"password"}
          />
        </View>
        <TouchableOpacity style={{ marginBottom: 25 }} onPress={() => socialLogin("web")}>
          <Text.Primary style={styles.mainBtn}>{t("REGISTER_SBT_BTN")}</Text.Primary>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#EBEBEB" }} />
          <View>
            <Text.Primary style={{ width: 50, textAlign: "center" }}>{t("REGISTER_SOCIAL_OR")}</Text.Primary>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#EBEBEB" }} />
        </View>
        <View style={styles.signinGroup}>
          {Platform.OS === "ios" ?
            <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("apple")}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Icon name="Apple" width="24" height="24" style={{ marginRight: 14 }} />
                <Text.Primary style={styles.signIn}>{t("REGISTER_APPLE")}</Text.Primary>
              </View>
            </TouchableOpacity> : <></> }
          <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("facebook")}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Icon name="Facebook" width="24" height="24" style={{ marginRight: 14 }} />
              <Text.Primary style={styles.signIn}>{t("REGISTER_FB")}</Text.Primary>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("google")}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Icon name="Google" width="24" height="24" style={{ marginRight: 14 }} />
              <Text.Primary style={styles.signIn}>{t("REGISTER_GOOGLE")}</Text.Primary>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.register}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text.Primary style={{ marginRight: 5 }}>{t("REGISTER_HAVE_ACCOUNT")}</Text.Primary>
            <TouchableOpacity onPress={() => navigator.openSignIn()}>
              <Text.Primary style={{ color: Colors.darkGreen }}>{t("REGISTER_LOGIN_BTN")}</Text.Primary>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

SignUpScreen.navigationOptions = navigationOptions();

export default SignUpScreen;
