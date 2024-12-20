import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Text, Comment } from "components";
import { Colors } from "style";

import navigationOptions from "./CommentsListScreen.navigationOptions";
import styles from "./CommentsListScreen.styles";
import { CommentsAPI } from "webservice";
import CommentSkeleton from "components/Comment/Comment.skeleton";
import Spinner from "react-native-loading-spinner-overlay";
import { isLogged } from "webservice/Login";
import Empty from "components/Empty";
import AuthVars from "constant/AuthVars";

const CommentsListScreen: NavStatelessComponent = () => {
  const route = useRoute();
  const commentInpt = useRef(null);
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const postID = route.params.postId;
  const addComment = route.params.addComment;
  const [loadingComments, setLoadingComments] = useState(true);
  const [sendingComment, setSendingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState([]);
  const [loadPage, setLoadedPage] = useState(1);
  const [loadingFirstTime, setLoadingFirstTime] = useState(true);

  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => setKeyboardStatus(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    getComments(1);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const getComments = (paging) => {
    console.log("getting comments", postID);
    setLoadingComments(true);
    CommentsAPI.list(paging, postID).then((response) => {
      if (paging <= response.paging.pages) {
        console.log(response.result.length);
        const newcomments = [];
        Object.keys(response.result).map((key) => {
          newcomments.push({
            comment_ID: response.result[key].comment_ID,
            userId: response.result[key].comment_author,
            avatarUri: response.result[key].author[0]?.avatar ? response.result[key].author[0].avatar : AuthVars.BLANK_IMAGE,
            comment: response.result[key].comment_content,
            publishDate: response.result[key].comment_date,
          });
        });
        setComments([...comments, ...newcomments]);
        setLoadingFirstTime(false);
        setLoadingComments(false);
      } else {
        console.log("end of pages");
        setLoadedPage(-1);
        setLoadingFirstTime(false);
        setLoadingComments(false);
      }
    });
  };

  const handleComment = (content) => {
    setCommentContent(content);
  };

  const renderItem = ({ item }) => {
    return (
      <Comment
        key={item.comment_ID}
        commentId={item.comment_ID}
        userId={item.userId}
        avatarUri={item.avatarUri}
        comment={item.comment}
        publishDate={item.publishDate}
      />
    );
  };

  const postComment = async () => {
    const userinfo = await isLogged();
    if (!userinfo) {
      navigator.openSignIn();
    } else {
      setSendingComment(true);
      CommentsAPI.add(postID, commentContent, userinfo.accesstoken).then((response) => {
        console.log(response);
        setSendingComment(false);
        if (response.respond === 0) {
          alert(response.message);
        } else {
          commentInpt.current.clear();
          Keyboard.dismiss();
          alert(t("PUBLISH_COMMENT_SUCCESS_MSG"));
        }
      });
    }
  };

  function newPage() {
    console.log("slide down event", loadPage);
    if (loadPage === -1) {
      return;
    } else if (loadPage === 0) {
      setLoadedPage(1);
    } else {
      setLoadedPage(loadPage + 1);
      getComments(loadPage + 1);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient colors={["#F3F9F3", "#FFFFFF"]} style={styles.linearGradient} />
      <View style={styles.container}>
        <Spinner visible={sendingComment} textContent={""} />
        <View style={styles.header}>
          <Text.Header
            style={{ textAlign: "center", fontSize: 18, fontWeight: "500", lineHeight: 27 }}
          >
            {"Comments"}
          </Text.Header>
          <TouchableOpacity style={{ position: "absolute", left: 20 }}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.darkGrey}
              onPress={() => navigator.goBack()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.comments}>
            <View style={{ paddingHorizontal: 25, height: keyboardStatus ? "50%" : "78%" }}>
              <FlatList
                data={comments}
                renderItem={renderItem}
                keyExtractor={(item) => item.comment_ID}
                onEndReached={(distance) => newPage()}
              />
              {loadingFirstTime ?
                <>
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                </> :
                !loadingComments && comments.length === 0 ? <Empty description={t("NO_COMMENTS_AVAILABLE")} />
                : <ActivityIndicator animating={loadingComments} size="large" color="#000000" /> }
            </View>
            <View style={[styles.newComment, { height: keyboardStatus ? "50%" : "20%" }]}>
              <TextInput
                ref={commentInpt}
                multiline={true}
                numberOfLines={4}
                onChangeText={(txt) => handleComment(txt)}
                placeholder={t("TYPE_COMMENT_HINT")}
                style={{ padding: 10 }}
                placeholderTextColor={"#757575"}
              />
              {addComment ?
                <TouchableOpacity onPress={() => postComment()}>
                  <Text.Primary style={styles.postComment}>{t("POST_COMMENT_BTN")}</Text.Primary>
                </TouchableOpacity> : <></> }
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

CommentsListScreen.navigationOptions = navigationOptions();

export default CommentsListScreen;
