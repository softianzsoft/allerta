import React, {useEffect, useState} from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { HomeNewsListItem, Text, Button } from "components";
import { Colors } from "style";

import navigationOptions from "./NotificationScreen.navigationOptions";
import styles from "./Notification.styles";
import HomeNewsListSkeleton from "components/HomeNewsListItem/HomeNewsListItem.skeleton";
import moment from "moment";
import * as Bookmarks from "webservice/Bookmarks";
import * as PushAPI from "webservice/Push";
import { isLogged } from "webservice/Login";
import Empty from "components/Empty";
import AuthVars from "constant/AuthVars";

const NotificationScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [bookmarks, setBookmarks] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [loadPage, setLoadedPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focused screen!!!");
      isLogged().then((userData) => {
        setUserInfo(userData);
      });
    });
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (userInfo && notificationList.length === 0) {
      getNotifications(1);
    }
    Bookmarks.getAll().then((ids) => setBookmarks(ids));
  }, [userInfo]);

  function getNotifications(currPage) {
    console.log("calling page", currPage);
    if (currPage === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    PushAPI.getNotifications(currPage, userInfo.userid).then((response) => {
      if (response.paging.pages === 0) {
        setLoadedPage(-1);
        setLoading(false);
        setLoadingMore(false);
      } else if (currPage <= response.paging.pages) {
        setNotificationList([...notificationList, ...response.result]);
        setLoading(false);
        setLoadingMore(false);
      } else {
        console.log("end of pages");
        setLoadedPage(-1);
        setLoading(false);
        setLoadingMore(false);
      }
    });
  }

  const openAction = (item) => {
    if (parseInt(item.post_id) > 0) {
      navigator.openPostDetail({ post: { postId: item.post_id, title: item.title, img_uri: item.bigimage, weblink: item.bigimage }, bookmarked: bookmarks.includes(parseInt(item.post_id))})
    } else {
      return false;
    }
  };

  const signIn = () => {
    navigator.openSignIn();
  };

  const renderItem = ({ item }) => (
    <HomeNewsListItem
      postId={item.post_id}
      uri={!item.icon || item.icon === "" ? AuthVars.BLANK_IMAGE : item.icon}
      title={item.message}
      author={moment(item.starttime).fromNow()}
      publish={""}
      onPress={() => openAction(item)}
    />
  );

  function newPage() {
    console.log("slide down event", loadPage);
    if (loadPage === -1) {
      return;
    } else if (loadPage === 0) {
      setLoadedPage(1);
    } else {
      setLoadedPage(loadPage + 1);
      getNotifications(loadPage + 1);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.mainBackground }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.blackGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
          <Text.Header style={styles.headerTtle}>{t("NOTIFICATIONS_CENTER_HEADER")}</Text.Header>
          {userInfo ?
            <View style={{ marginBottom: 160 }}>
              {!isLoading && notificationList.length === 0 ?
                <Empty description={t("NOTIFICATIONS_CENTER_EMPTY")} /> :
              isLoading ?
                <>
                  <HomeNewsListSkeleton />
                  <HomeNewsListSkeleton />
                  <HomeNewsListSkeleton />
                </> :
                <FlatList
                  data={notificationList}
                  renderItem={renderItem}
                  keyExtractor={(item) => `${Date.now()}_${item.id}`}
                  onEndReached={(distance) => newPage()}
                />
              }
              <ActivityIndicator animating={isLoadingMore} size="large" color="#000000" />
            </View>
          :
            <View style={[styles.signIn, { height: height / 2 }]}>
              <Text.Primary>{t("REQUIRED_SIGNIN_MSG")}</Text.Primary>
              <Button.Secondary onPress={signIn} textType={"Secondary"} fullWidth={false} lessRadius={true} blue style={{ marginTop: 30 }}>
                <Text.Secondary center blue>
                  {t("REQUIRED_SIGNIN_BTN")}
                </Text.Secondary>
              </Button.Secondary>
            </View>
          }
        </View>
      </View>
    </View>
  );
};

NotificationScreen.navigationOptions = navigationOptions();

export default NotificationScreen;
