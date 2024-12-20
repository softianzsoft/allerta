import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-snap-carousel";

import { Text, HomepageBanner, HomeNewsListItem, Icon } from "components";
import { t } from "utils";
import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Colors } from "style";

import styles from "./HomeScreen.styles";
import navigationOptions from "./HomeScreen.navigationOptions";
import * as Bootstrape from "webservice/Bootstrape";
import { PostsAPI } from "webservice";
import * as Bookmarks from "webservice/Bookmarks";
import Skeleton from "components/Skeleton";
import HomeNewsListSkeleton from "components/HomeNewsListItem/HomeNewsListItem.skeleton";
import * as Notifications from "expo-notifications";

const SLIDER_WIDTH = Dimensions.get("window").width;

const HomeScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [appConfig, setAppConfig] = useState([]);
  const [configLoading, setConfigLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [highlightPosts, setHighlightPosts] = useState([]);
  const [sliderPosts, setSlidertPosts] = useState([]);
  const [categoryName, setCategoryName] = React.useState(t("HOME_HIGHLIGHT_POSTS_TITLE"));
  const [bookmarks, setBookmarks] = useState([]);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [loadPage, setLoadedPage] = useState(1);
  const [postsCatIDs, setPostsCatIDs] = useState(0);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      //Parse a notification once user clicks on it when app is opened or closed
      //alert(JSON.stringify(lastNotificationResponse.notification.request.content.data));
      const payload = lastNotificationResponse.notification.request.content.data;
      navigation.jumpTo("HomeNavigator");
      if (payload.relatedvalue) {
        navigator.openPostDetail({post: {postId: payload.relatedvalue}, bookmarked: false});
      } else if (payload.postid) {
        navigator.openPostDetail({post: {postId: payload.postid}, bookmarked: false});
      } else if (payload.link) {
      }
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    Bookmarks.getAll().then((ids) => setBookmarks(ids));
    console.log("getting app config for home");
    Bootstrape.load().then((config) => {
      setAppConfig(config);
      setConfigLoading(false);
    });
  }, []);

  useEffect(() => {
    if (appConfig.timeout) {
      loadCategoryPosts("196,11560,147", t("HOME_HIGHLIGHT_POSTS_TITLE"), 1);
      if (appConfig.homepage.popular) {
        loadSliderPosts("196,11560,147");
      } else {
        setSliderLoading(false);
        setCategoryName(t("HOME_RECENT_POSTS_TITLE"));
      }
    }
  }, [appConfig]);

  const searchReq = (query) => {
    navigator.openPostList({ action: "search", query: query });
  };

  const loadCategoryPosts = (catID, catName, currPage) => {
    setLoadedPage(currPage);
    if(currPage === 1){
      setHighlightPosts([]);
    }
    if(catName !== ""){
      setCategoryName(catName);
    }
    let categoryID;
    if(catName !== ""){
      categoryID = catID;
      setPostsCatIDs(catID);
    } else {
      categoryID = postsCatIDs;
    }
    setPostsLoading(true);
    PostsAPI.highlight(categoryID, appConfig.homepage.posts, currPage).then((response) => {
      if (currPage <= response.paging.pages) {
        const posts = PostsAPI.postBakery(response.result);
        if(currPage === 1){
          setHighlightPosts(posts);
        } else {
          setHighlightPosts([...highlightPosts, ...posts]);
        }
        setPostsLoading(false);
      } else if(response.paging.result === 0 && currPage === 1) {
        setHighlightPosts([]);
        setPostsLoading(false);
      } else {
        console.log("end of pages");
        setLoadedPage(-1);
        setPostsLoading(false);
      }
    });
  };

  const loadSliderPosts = (catID) => {
    setSliderLoading(true);
    PostsAPI.slider(catID).then((response) => {
      if (response.paging.result > 0) {
        const posts = PostsAPI.postBakery(response.result);
        setSlidertPosts(posts);
      } else {
        setSlidertPosts([]);
      }
      setSliderLoading(false);
    });
  };

  const renderSlider = ({ item, index }) => {
    return (
      <HomepageBanner
        uri={item.img_uri}
        title={item.title}
        date={item.publishDate}
        onPress={() => navigator.openPostDetail({post: item, bookmarked: bookmarks.includes(parseInt(item.postId))})}
      />
    );
  };

  function newPage() {
    if (postsLoading) return;
    console.log("slide down event", loadPage);
    if (loadPage === -1) {
      return;
    } else if (loadPage === 0) {
      setLoadedPage(1);
    } else {
      setLoadedPage(loadPage + 1);
      loadCategoryPosts("", "", loadPage + 1);
    }
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <ScrollView
        style={styles.container}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            newPage();
          }
        }}
        scrollEventThrottle={400}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.menuIcon}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Icon fill="none" width="24" height="24" name={"Menu"} />
          <Text.Primary style={styles.menuWord}>Menu</Text.Primary>
        </TouchableOpacity>
        <Text.Header style={{ marginBottom: 4 }}>{t("HOME_HEADER_TITLE")}</Text.Header>
        <Text.Primary>{t("HOME_HEADER_SEC_TITLE")}</Text.Primary>
        <View style={styles.SearchbarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder={t("HOME_SEARCH_INPT_HINT")}
            placeholderTextColor={Colors.grey70}
            onSubmitEditing={(event) => searchReq(event.nativeEvent.text)}
            returnKeyType={"search"}
          />
          <Icon
            fill="none"
            width="18"
            height="18"
            name="Search"
            style={{ position: "absolute", right: 16, top: 15 }}
          />
        </View>
        <ScrollView
          style={styles.categories}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {configLoading ? <></> : appConfig.homepage.categories.map((category, i) => (
            <TouchableOpacity key={i} onPress={() => loadCategoryPosts(category.id, category.name, 1)}>
              <Text.Primary center bold style={styles.categories}>
                {category.name}
              </Text.Primary>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text.Secondary style={styles.recentPost}>{categoryName}</Text.Secondary>
        {sliderLoading ? <Skeleton type={"slider"} width={SLIDER_WIDTH - 35} height={250} />
        : sliderPosts.length > 0 ?
          <View style={{ marginLeft: -20, marginBottom: 20 }}>
            <Carousel
              data={sliderPosts}
              renderItem={renderSlider}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={SLIDER_WIDTH}
              layout={"stack"}
              layoutCardOffset={18}
            />
          </View> : <></> }
        <View>
          {postsLoading && highlightPosts.length === 0 ?
            <>
              <HomeNewsListSkeleton />
              <HomeNewsListSkeleton />
              <HomeNewsListSkeleton />
            </> : highlightPosts.map((listItem, index) => (
              <HomeNewsListItem
                key={index}
                postId={listItem.postId}
                uri={listItem.img_uri}
                title={listItem.title}
                author={listItem.category}
                publish={listItem.publishDate}
                onPress={() => navigator.openPostDetail({post: listItem, bookmarked: bookmarks.includes(parseInt(listItem.postId))})}
              />
            ))
          }
          {postsLoading && highlightPosts.length > 0 ?
          <ActivityIndicator size="small" color="#000000" /> : <></> }
        </View>
      </ScrollView>
    </View>
  );
};

HomeScreen.navigationOptions = navigationOptions();

export default HomeScreen;
