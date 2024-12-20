import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Text } from "components";
import { t } from "utils";
import { Colors } from "style";
import Post from "components/Post";
import Empty from "components/Empty";

import navigationOptions from "./PostListScreen.navigationOptions";
import styles from "./PostListScreen.styles";
import { PostsAPI } from "webservice";
import * as Bookmarks from "webservice/Bookmarks";

const PostListScreen: NavStatelessComponent = () => {
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const route = useRoute();
  const [postsList, setPosts] = useState([]);
  const [loadPage, setLoadedPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [pageName, setPageName] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  const categoryParam = route.params;

  useEffect(() => {
    if (categoryParam.action === "bookmarks" && bookmarks.length > 0) {
      loadingAction(1);
    } else if (bookmarks.length === 0) {
      Bookmarks.getAll().then((ids) => {
        if (ids.length === 0) {
          if (categoryParam.action === "bookmarks") {
            setPageName("Bookmarks");
            setLoading(false);
          }
        } else {
          setBookmarks(ids);
        }
      });
    }
  }, [bookmarks]);

  useEffect(() => {
    console.log("route params", route.params);
    if (categoryParam.action !== "bookmarks") {
      loadingAction(1);
    }
  }, []);

  function loadingAction(paging) {
    switch (categoryParam.action) {
      case "bookmarks":
        setPageName(t("POSTS_BOOKMARKS_TITLE"));
        if (bookmarks.length > 0) {
          getBookmarks(paging);
        }
        break;
      case "search":
        setPageName(t("POSTS_SEARCH_TITLE"));
        searchPosts(paging);
        break;
      default:
        setPageName(categoryParam.name);
        getPosts(paging);
        break;
    }
  }

  function emptyDesc() {
    switch (categoryParam.action) {
      case "bookmarks":
        return t("POSTS_BOOKMARKS_EMPTY");
      case "search":
        return t("POSTS_SEARCH_NORESULTS");
      default:
        return t("POSTS_NO_DATA");
    }
  }

  function newPage() {
    if (isLoading) return;
    console.log("slide down event", loadPage);
    if (loadPage === -1) {
      return;
    } else if (loadPage === 0) {
      setLoadedPage(1);
    } else {
      setLoadedPage(loadPage + 1);
      loadingAction(loadPage + 1);
    }
  }

  function getBookmarks(currPage) {
    setLoading(true);
    console.log("calling page", currPage);
    PostsAPI.bookmarks(bookmarks).then((response) => {
      if (response.result.length > 0) {
        console.log("end of pages");
        const posts = PostsAPI.postBakery(response.result);
        setPosts(posts);
        setLoadedPage(-1);
        setLoading(false);
      }
    });
  }

  function getPosts(currPage) {
    setLoading(true);
    console.log("calling page", currPage);
    PostsAPI.list(currPage, categoryParam.id).then(async (response) => {
      if (currPage <= response.paging.pages) {
        const posts = PostsAPI.postBakery(response.result);
        setPosts([...postsList, ...posts]);
        setLoading(false);
      } else {
        console.log("end of pages");
        setLoadedPage(-1);
        setLoading(false);
      }
    });
  }

  function searchPosts(currPage) {
    setLoading(true);
    console.log("calling page", currPage);
    PostsAPI.search(currPage, categoryParam.query).then((response) => {
      if (currPage <= response.paging.pages) {
        const posts = PostsAPI.postBakery(response.result);
        setPosts([...postsList, ...posts]);
        setLoading(false);
      } else {
        console.log("end of pages");
        setLoadedPage(-1);
        setLoading(false);
      }
    });
  }

  const renderItem = ({ item }) => (
    <Post
      key={item.postId}
      postId={item.postId}
      isSaved={bookmarks.includes(parseInt(item.postId))}
      img_uri={item.img_uri === "" ? null : item.img_uri}
      title={item.title}
      weblink={item.guid}
      publishDate={item.publishDate}
      onPress={() => navigator.openPostDetail({post: item, bookmarked: bookmarks.includes(parseInt(item.postId))})}
      recommend={item.likes}
      category={item.category}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text.Header style={styles.category_name}>{categoryParam?.name}</Text.Header>
          <TouchableOpacity style={styles.back_btn}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.darkGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 130 }}>
          <Text.Header style={styles.headerTtle}>{pageName}</Text.Header>
          {!isLoading && postsList.length === 0 ?
            <Empty description={emptyDesc()} />
          :
            <FlatList
              data={postsList}
              renderItem={renderItem}
              keyExtractor={(item) => item.postId}
              onEndReached={(distance) => newPage()}
            />
          }
          <ActivityIndicator animating={isLoading} size="large" color="#000000" />
        </View>
      </View>
    </View>
  );
};

PostListScreen.navigationOptions = navigationOptions();

export default PostListScreen;
