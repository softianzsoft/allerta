import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, TouchableOpacity, View} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Icon, Text, TextInput } from "components";
import { facebookLogin, appleLogin, googleLogin, webLogin } from "components/SocialLogin";
import { Colors } from "style";

import navigationOptions from "./SignInScreen.navigationOptions";
import styles from "./SignInScreen.styles";
import { isLogged } from "webservice/Login";

const SignInScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focused screen!!!");
      isLogged().then((userData) => {
        if (userData) {
          navigator.goBack();
        }
      });
    });
    return () => {
      unsubscribe;
    };
  }, []);

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
        success = await webLogin(username, password);
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
          <Text.Header style={styles.headerTtle}>{t("LOGIN_HEADER")}</Text.Header>
          <Text.Primary style={styles.headerDesc}>
            {t("LOGIN_SEC_HEADER")}
          </Text.Primary>
        </View>
        <Text.Primary style={styles.inputTitle}>{"Username"}</Text.Primary>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder={t("LOGIN_USERNAME_HINT")}
            isOptional={false}
            onchange={(txt) => usernameEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
          />
        </View>
        <Text.Primary style={styles.inputTitle}>{t("LOGIN_PWD_INPT")}</Text.Primary>
        <View>
          <TextInput
            placeholder={t("LOGIN_PWD_HINT")}
            isOptional={false}
            secured={true}
            onchange={(txt) => passwordEntry(txt)}
            background={Colors.transparent}
            borderColor={Colors.grey}
            contentType={"password"}
          />
        </View>
        <TouchableOpacity onPress={() => navigator.openForgetPwd()}>
          <Text.Primary style={styles.forgotPass}>{t("LOGIN_FORGET_BTN")}</Text.Primary>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: 25 }} onPress={() => socialLogin("web")}>
          <Text.Primary style={styles.mainBtn}>{t("LOGIN_SBT_BTN")}</Text.Primary>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#EBEBEB" }} />
          <View>
            <Text.Primary style={{ width: 50, textAlign: "center" }}>{t("LOGIN_SOCIAL_OR")}</Text.Primary>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "#EBEBEB" }} />
        </View>
        <View style={styles.signinGroup}>
          {Platform.OS === "ios" ? (
            <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("apple")}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Icon name="Apple" width="24" height="24" style={{ marginRight: 14 }} />
                <Text.Primary style={styles.signIn}>{t("LOGIN_APPLE")}</Text.Primary>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("facebook")}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Icon name="Facebook" width="24" height="24" style={{ marginRight: 14 }} />
              <Text.Primary style={styles.signIn}>{t("LOGIN_FB")}</Text.Primary>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInGoogle} onPress={() => socialLogin("google")}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Icon name="Google" width="24" height="24" style={{ marginRight: 14 }} />
              <Text.Primary style={styles.signIn}>{t("LOGIN_GOOGLE")}</Text.Primary>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.register}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text.Primary style={{ marginRight: 5 }}>{t("LOGIN_NO_ACCOUNT_MSG")}</Text.Primary>
            <TouchableOpacity onPress={() => navigator.openSignUp()}>
              <Text.Primary style={{ color: Colors.darkGreen }}>{t("LOGIN_REGISTER_BTN")}</Text.Primary>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

SignInScreen.navigationOptions = navigationOptions();

export default SignInScreen;
