import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import ToggleSwitch from "toggle-switch-react-native";
import * as FeatherIcon from "react-native-feather";
import * as StoreReview from "expo-store-review";
import * as Application from "expo-application";

import { t } from "utils";
import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Colors } from "style";
import { Icon, Text, TextInput } from "components";
import Spinner from "react-native-loading-spinner-overlay";

import styles from "./SettingsScreen.styles";
import navigationOptions from "./SettingsScreen.navigationOptions";
import { clearLogin, isLogged } from "webservice/Login";
import { getSettings, saveSettings } from "webservice/DB";
import * as AuthorAPI from "webservice/Author";
import ChooseLangScreen from "../ChooseLang";

const SettingsScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);

  const [isOnNotification, setIsOnNotification] = useState(false);
  const [isOnLocation, setIsOnLocation] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState(false);
  const [pureForm, setPureForm] = useState(true);

  const [modalLangVisible, setModalLangVisible] = useState(false);
  const langs = [
    { name: "Italiana", code: "it" },
    { name: "English", code: "en" },
  ];
  const [defLang, setDefLang] = useState("");
  const langPicker = langs.filter(lang => lang.code === defLang);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focused screen!!!");
      isLogged().then((userData) => {
        setUserInfo(userData);
      });
      getSettings("notification", "true").then((state) => setIsOnNotification(state === "true"));
      getSettings("location", "false").then((state) => setIsOnLocation(state === "true"));
    });
    loadDefLang();
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (userInfo && !profile) {
      AuthorAPI.get(userInfo.userid).then((profileData) => {
        setProfile(true);
        setFullName(profileData.display_name);
        setWebsite(profileData.user_url);
        setBio(profileData.description);
      });
    }
  }, [userInfo]);

  const loadDefLang = async () => {
    const userLang = await getSettings("lang", "en");
    setDefLang(userLang);
  };

  const signOut = () => {
    clearLogin().then((success) => setUserInfo(false));
  };

  const signIn = () => {
    navigator.openSignIn();
  };

  const saveProfile = () => {
    setLoading(true);
    AuthorAPI.update(userInfo.accesstoken, fullName, website, bio).then((success) => {
      setLoading(false);
      setPureForm(true);
    });
  };

  const saveOptionDB = (option, value) => {
    saveSettings(option, value);
  };

  const rateApp = async () => {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  };

  const closeModalLang = () => {
    setModalLangVisible(false);
  };

  const terminateAccount = async () => {
    Alert.alert(
      t("CONFIRMATION"),
      t("DELETE_ACCOUNT_CONFIRMATION"),
      [
      {
        text: t("CANCEL_PROMPT_MESSAGE"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: t("PROCEED_PROMPT_MESSAGE"),
        onPress: () => {
          setLoading(true);
          AuthorAPI.terminate(userInfo.accesstoken).then((success) => {
            clearLogin().then((success) => {
              setUserInfo(false);
              setLoading(false);
            });
          });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <Spinner visible={isLoading} textContent={""} />
        <View style={styles.header}>
          <TouchableOpacity style={{ marginRight: 16 }} onPress={() => navigator.goBack()}>
            <Icon name="Settings_active" width={"24"} height={"24"} fill={"none"} />
          </TouchableOpacity>
          <Text.Header style={styles.headerTitle}>{t("SETTINGS_HEAD_TITLE")}</Text.Header>
          {userInfo && !pureForm ?
            <TouchableOpacity onPress={() => saveProfile()} style={{ position: "absolute", right: 10, }}>
              <MaterialCommunityIcons name="content-save-edit" size={24} color={Colors.blackGrey} />
            </TouchableOpacity> : <></>}
        </View>
        <View style={styles.channelContainer}>
          <Text.Primary style={styles.optionHeader}>{t("SETTINGS_SEC_TITLE")}</Text.Primary>
          <TouchableOpacity onPress={() => setModalLangVisible(true)}>
            <Text.Primary style={styles.newScreenBtn}>{t("SELECT_LANGUAGE")}</Text.Primary>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={Colors.blackGrey}
              style={{ position: "absolute", right: 20, top: 14 }}
            />
            <Text.Secondary
              style={{ position: "absolute", top: 15, right: 44, color: Colors.inactive }}
            >
              {langPicker[0]?.name}
            </Text.Secondary>
          </TouchableOpacity>
          <View style={styles.settingSwitch}>
            <Text.Primary style={styles.newScreenBtn}>{t("SETTINGS_NOTIFICATION_TOGGLE")}</Text.Primary>
            <ToggleSwitch
              isOn={isOnNotification}
              onColor={Colors.green}
              offColor={Colors.inactive}
              size="default"
              onToggle={(isOnNotification) => {
                saveOptionDB("notification", isOnNotification ? "true" : "false");
                setIsOnNotification(isOnNotification);
              }}
              style={styles.switch}
            />
          </View>
          <View style={styles.settingSwitch}>
            <Text.Primary style={styles.newScreenBtn}>{t("SETTINGS_LOCATION_TOGGLE")}</Text.Primary>
            <ToggleSwitch
              isOn={isOnLocation}
              onColor={Colors.green}
              offColor={Colors.inactive}
              size="default"
              onToggle={(isOnLocation) => {
                saveOptionDB("location", isOnLocation ? "true" : "false");
                setIsOnLocation(isOnLocation);
              }}
              style={styles.switch}
            />
          </View>
        </View>
        <View>
          {userInfo ?
            <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <FeatherIcon.LogOut
                  width="24"
                  height="24"
                  color={Colors.red}
                  style={{ marginRight: 10 }}
                />
                <Text.Primary style={styles.logout}>{t("SETTINGS_LOG_OUT")}</Text.Primary>
              </View>
            </TouchableOpacity>
          :
            <></>
          }
          <TouchableOpacity onPress={() => rateApp()}>
            <Text.Primary style={styles.transparentBtn}>{t("SETTINGS_RATE_APP")}</Text.Primary>
          </TouchableOpacity>
          <Text.Primary style={styles.transparentBtn}>{t("SETTINGS_APP_VERSION")} {Application.nativeApplicationVersion}</Text.Primary>
          {userInfo ?
            <TouchableOpacity onPress={() => terminateAccount()}>
              <Text.Primary style={[styles.transparentBtn, { color: Colors.red }]}>{t("SETTINGS_DEACTIVATE_ACCOUNT")}</Text.Primary>
            </TouchableOpacity> : <></> }
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalLangVisible}
        onRequestClose={() => {
          setModalLangVisible(!modalLangVisible);
        }}>
        <ChooseLangScreen close={closeModalLang} langList={langs} savedLang={defLang} />
      </Modal>
    </View>
  );
};

SettingsScreen.navigationOptions = navigationOptions();

export default SettingsScreen;
