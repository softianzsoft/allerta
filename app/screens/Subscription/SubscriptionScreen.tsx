import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, useWindowDimensions, View, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ToggleSwitch from "toggle-switch-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Tags from "react-native-tags";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Button, Text } from "components";
import { Colors } from "style";

import navigationOptions from "./SubscriptionScreen.navigationOptions";
import styles from "./SubscriptionScreen.styles";
import { isLogged } from "webservice/Login";
import * as PushAPI from "webservice/Push";
import CustomizeByCategoriesScreen from "../CustomizeByCategories";
import CustomizeNotificationScreen from "../CustomizeNotification";

const SubscriptionScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const { height, width } = useWindowDimensions();

  const [isLoading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const [modalCatVisible, setModalCatVisible] = useState(false);
  const [modalChanVisible, setModalChanVisible] = useState(false);

  const [isOnWebPushNotification, setIsOnWebPushNotification] = useState(false);
  const [isOnMobilePushNotification, setIsOnMobilePushNotification] = useState(false);
  const [isOnFacebookMessenger, setIsOnFacebookMessenger] = useState(false);
  const [isOnEmail, setIsOnEmail] = useState(false);
  const [catStates, setCatStates] = useState([]);
  const [chansStates, setChansStates] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const [subscription, setSubscription] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focused screen!!!");
      isLogged().then((userData) => {
        if (userData) {
          setUserInfo(userData);
        }
      });
    });
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (userInfo && !subscription) {
      getSubscription();
    }
  }, [userInfo]);

  useEffect(() => {
    if (subscription) {
      setIsOnWebPushNotification(parseInt(subscription.web) !== 0);
      setIsOnMobilePushNotification(parseInt(subscription.mobile) !== 0);
      setIsOnFacebookMessenger(parseInt(subscription.msn) !== 0);
      setIsOnEmail(parseInt(subscription.email) !== 0);

      if (subscription.keywords === "") {
        setKeywords([""]);
      } else {
        setKeywords(subscription.keywords.split(",").filter((tag) => tag !== ""));
      }

      const statesCat = [];
      subscription.categories.forEach((category) => {
        statesCat.push(parseInt(category.selected) !== 0);
      });
      setCatStates(statesCat);

      const statesChans = [];
      subscription.channels.forEach((channel) => {
        statesChans.push(channel.subscribed === "yes");
      });
      setChansStates(statesChans);
    }
  }, [subscription]);

  const getSubscription = () => {
    setLoading(true);
    PushAPI.getSubscription(userInfo.userid).then((response) => {
      setLoading(false);
      setSubscription(response.result);
    });
  };

  const delAccount = () => {
    Alert.alert(t("SUBS_DEL_PROMPT_TITLE"), t("SUBS_DEL_PROMPT_MSG"), [
      {
        text: t("SUBS_DEL_PROMPT_BTN_CANCEL"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: t("SUBS_DEL_PROMPT_BTN_OK"),
        onPress: () => {
          setLoading(true);
          PushAPI.delSubscription(userInfo.userid).then((response) => {
            setLoading(false);
            setSubscription(false);
            navigator.goBack();
          });
        },
      },
    ]);
  };

  const submitChanges = () => {
    setLoading(true);

    const categories = [];
    subscription.categories.forEach((category, index) => {
      if (catStates[index]) {
        categories.push(category.id);
      }
    });

    const channels = [];
    subscription.channels.forEach((channel, index) => {
      if (chansStates[index]) {
        channels.push(channel.id);
      }
    });

    const web = isOnWebPushNotification ? 1 : 0;
    const mobile = isOnMobilePushNotification ? 1 : 0;
    const msn = isOnFacebookMessenger ? 1 : 0;
    const email = isOnEmail ? 1 : 0;

    const tags = keywords.filter((tag) => tag !== "").join(",");

    PushAPI.saveSubscription(userInfo.userid, categories, channels, tags, web, mobile, msn, email).then((response) => {
      setLoading(false);
    });
  };

  const closeModalCat = (selections) => {
    setCatStates(selections);
    setModalCatVisible(false);
  };

  const closeModalChan = (selections) => {
    setChansStates(selections);
    setModalChanVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView style={styles.container}>
        <Spinner visible={isLoading} textContent={""} />
        <View style={styles.header}>
          <Text.Header style={styles.headerTtle}>{t("SUBS_HEADER_TITLE")}</Text.Header>
          <TouchableOpacity style={styles.back_btn}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
        </View>
        {userInfo ?
          <>
            <View style={styles.channelContainer}>
              <Text.Primary style={styles.optionHeader}>{t("SUBS_NOTIFICATIONS_PREFERENCES")}</Text.Primary>
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => setModalChanVisible(true)}
              >
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_CUSTOMIZE_CHANNELS_BTN")}</Text.Primary>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={Colors.blackGrey}
                  style={{ position: "absolute", right: 20, top: 14 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalCatVisible(true)}>
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_CUSTOMIZE_CATEGORIES_BTN")}</Text.Primary>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={Colors.blackGrey}
                  style={{ position: "absolute", right: 20, top: 14 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.keywords}>
              <Text.Primary style={styles.optionHeader}>{t("SUBS_KEYWORDS_HEADER")}</Text.Primary>
              {keywords.length > 0 ?
                <Tags
                  initialTags={keywords}
                  textInputProps={{
                    placeholder: t("SUBS_KEYWORDS_DIFF"),
                    placeholderTextColor: Colors.blackGrey,
                  }}
                  onChangeTags={(tags) => setKeywords(tags)}
                  inputStyle={{ backgroundColor: Colors.grey10 }}
                /> : <></>
              }
            </View>
            <View style={styles.receiveOn}>
              <Text.Primary style={styles.optionHeader}>{t("SUBS_TOGGLES_TITLE")}</Text.Primary>
              <View style={styles.settingSwitch}>
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_TOGGLES_WEBPUSH")}</Text.Primary>
                <ToggleSwitch
                  isOn={isOnWebPushNotification}
                  onColor={Colors.green}
                  offColor={Colors.inactive}
                  size="default"
                  onToggle={(isOnWebPushNotification) => {
                    setIsOnWebPushNotification(isOnWebPushNotification);
                  }}
                  style={styles.switch}
                />
              </View>
              <View style={styles.settingSwitch}>
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_TOGGLES_MOBILE")}</Text.Primary>
                <ToggleSwitch
                  isOn={isOnMobilePushNotification}
                  onColor={Colors.green}
                  offColor={Colors.inactive}
                  size="default"
                  onToggle={(isOnMobilePushNotification) => {
                    setIsOnMobilePushNotification(isOnMobilePushNotification);
                  }}
                  style={styles.switch}
                />
              </View>
              <View style={styles.settingSwitch}>
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_TOGGLES_FBMSN")}</Text.Primary>
                <ToggleSwitch
                  isOn={isOnFacebookMessenger}
                  onColor={Colors.green}
                  offColor={Colors.inactive}
                  size="default"
                  onToggle={(isOnFacebookMessenger) => {
                    setIsOnFacebookMessenger(isOnFacebookMessenger);
                  }}
                  style={styles.switch}
                />
              </View>
              <View style={styles.settingSwitch}>
                <Text.Primary style={styles.newScreenBtn}>{t("SUBS_TOGGLES_EMAIL")}</Text.Primary>
                <ToggleSwitch
                  isOn={isOnEmail}
                  onColor={Colors.green}
                  offColor={Colors.inactive}
                  size="default"
                  onToggle={(isOnEmail) => {
                    setIsOnEmail(isOnEmail);
                  }}
                  style={styles.switch}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => submitChanges()}>
                <Text.Primary style={styles.mainBtn}>{t("SUBS_SAVE_BTN")}</Text.Primary>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => delAccount()}>
                <Text.Primary style={styles.deleteSubscription}>
                  {t("SUBS_DELETE_BTN")}
                </Text.Primary>
              </TouchableOpacity>
            </View>
          </>
        :
          <View style={[styles.signIn, { height: height / 2 }]}>
            <Text.Primary>{t("REQUIRED_SIGNIN_MSG")}</Text.Primary>
            <Button.Secondary onPress={() => navigator.openSignIn()} textType={"Secondary"} fullWidth={false} lessRadius={true} blue style={{ marginTop: 30 }}>
              <Text.Secondary center blue>
                {t("REQUIRED_SIGNIN_BTN")}
              </Text.Secondary>
            </Button.Secondary>
          </View>
        }
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalCatVisible}
        onRequestClose={() => {
          setModalCatVisible(!modalCatVisible);
        }}>
        <CustomizeByCategoriesScreen close={closeModalCat} categories={subscription.categories} selections={catStates} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalChanVisible}
        onRequestClose={() => {
          setModalChanVisible(!modalChanVisible);
        }}>
        <CustomizeNotificationScreen close={closeModalChan} channels={subscription.channels} selections={chansStates} />
      </Modal>
    </View>
  );
};

SubscriptionScreen.navigationOptions = navigationOptions();

export default SubscriptionScreen;
