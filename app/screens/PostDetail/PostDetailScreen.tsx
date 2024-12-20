import React, { useEffect, useState } from "react";
import { ScrollView, View, Image, TouchableOpacity, Share, useWindowDimensions, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import moment from "moment";
import { t } from "utils";

import { navigate } from "navigation";
import { NavStatelessComponent } from "interfaces";
import { Icon, Text, Comment } from "components";
import { Colors } from "style";
import * as Bookmarks from "webservice/Bookmarks";

import navigationOptions from "./PostDetailScreen.navigationOptions";
import styles from "./PostDetailScreen.styles";
import SkeletonComp from "components/Skeleton";
import { PostsAPI, CommentsAPI } from "webservice";
import CommentSkeleton from "components/Comment/Comment.skeleton";
import { isLogged } from "webservice/Login";
import AuthVars from "constant/AuthVars";
import * as Bootstrape from "../../webservice/Bootstrape";

const PostDetailScreen: NavStatelessComponent = () => {
  const route = useRoute();
  const post = route.params?.post;
  const bookmarked = route.params?.bookmarked;
  const navigation = useNavigation();
  const navigator = navigate(navigation);
  const [postBookmarked, setBookmarked] = useState(bookmarked);
  const [isLoading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [postData, setPostData] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postIMG, setPostIMG] = useState(AuthVars.BLANK_IMAGE);
  const [postWebLink, setPostWebLink] = useState("");
  const [comments, setComments] = useState([]);
  const [appConfig, setAppConfig] = useState([]);
  const [likeIconColor, setLikeIconColor] = useState("white");
  const { width } = useWindowDimensions();

  useEffect(() => {
    Bootstrape.load().then((config) => {
      setAppConfig(config);
    });
    setPostTitle(post.title ? post.title : "");
    setPostIMG(post.img_uri ? post.img_uri : AuthVars.BLANK_IMAGE);
    setPostWebLink(post.weblink ? post.weblink : "");
    getPostData();
    getComments();
  }, []);

  const getComments = () => {
    console.log("getting comments", post.postId);
    setLoadingComments(true);
    CommentsAPI.list(1, post.postId).then((data) => {
      setComments(data.result);
      setLoadingComments(false);
    });
  };

  const getPostData = () => {
    console.log("getting post", post.postId);
    setLoading(true);
    PostsAPI.get(post.postId).then((data) => {
      setPostData(data.result[0]);
      setPostTitle(data.result[0].post_title);
      setPostIMG(data.result[0].featuredimage === "" ? AuthVars.BLANK_IMAGE : data.result[0].featuredimage);
      setPostWebLink(data.result[0].guid);
      setLoading(false);
    });
  };

  const postComment = async () => {
    navigator.openCommentDetail({postId: post.postId, addComment: appConfig.postview?.addComment});
  };

  const saveBookmark = async (postID) => {
    if (postBookmarked) {
      Bookmarks.remove(postID);
      setBookmarked(false);
    } else {
      Bookmarks.add(postID);
      setBookmarked(true);
    }
  };

  const likePost = async () => {
    isLogged().then((userInfo) => {
      if (userInfo) {
        PostsAPI.like(userInfo.accesstoken, post.postId).then((data) => setLikeIconColor("black"));
      } else {
        Alert.alert(t("PROMPT_SIGNIN_TITLE"), t("PROMPT_SIGNIN_MSG"), [
          {
            text: t("PROMPT_SIGNIN_CANCEL_BTN"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: t("PROMPT_SIGNIN_OK_BTN"), onPress: () => navigator.openSignIn() },
        ]);
      }
    });
  };

  const onShare = async (weblink) => {
    console.log("sharing");
    try {
      const result = await Share.share({
        message: `${t("POST_SHARE_MSG")} ${weblink}`,
        url: weblink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const tagsStyles = {
    div: {
      fontSize: 16,
      lineHeight: 28,
      display: "block",
    },
    p: {
      fontSize: 16,
      lineHeight: 28,
      display: "block",
    },
    a: {
      color: "blue",
    },
    ul: {
      fontSize: 16,
    },
    ol: {
      fontSize: 16,
    },
    li: {
      margin: 0,
      fontSize: 16,
      padding: 0,
    },
    img: {
      maxWidth: "100%",
    },
    h1: {
      fontSize: 22,
    },
    h2: {
      fontSize: 20,
    },
    h3: {
      fontSize: 18,
    },
    h4: {
      fontSize: 16,
    },
    h5: {
      fontSize: 14,
    },
    h6: {
      fontSize: 12,
    },
  };

  return (
    <ScrollView>
      <Image source={{ uri: postIMG }} style={styles.image} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigator.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            <TouchableOpacity onPress={() => saveBookmark(post.postId)}>
              <MaterialCommunityIcons
                name="heart"
                size={24}
                color={postBookmarked ? "#ED5466" : Colors.white}
                style={[styles.rightAction, { marginLeft: 0 }]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShare(postWebLink)}>
              <Icon name="Back" width="24" height="20" fill="none" style={styles.rightAction} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.short_info}>
          {isLoading ? <SkeletonComp style={styles.categoryLoading} type={"text"} width={120} height={30} loading={isLoading} />
            : appConfig.postview?.showCats === 1 ? <Text.Secondary style={styles.category}>{postData.category[0]?.name}</Text.Secondary> : <></> }
          <View style={{ display: "flex", flexDirection: "row", paddingLeft: 14 }}>
            <View style={styles.comments_number}>
              <Icon name="Message" fill="none" width="16" height="16" />
              <Text.Tertiary style={styles.numberstyle}>{isLoading ? <SkeletonComp type={"text"} width={15} height={15} loading={isLoading} /> : postData.comment_count }</Text.Tertiary>
            </View>
            <View style={styles.seen_number}>
              <Icon name="Eye" fill="none" width="16" height="16" />
              <Text.Tertiary style={styles.numberstyle}>{isLoading ? <SkeletonComp type={"text"} width={15} height={15} loading={isLoading} /> : postData.likes }</Text.Tertiary>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          {isLoading ?
            <>
              <Text.H1 style={styles.title}>{postTitle}</Text.H1>
              <SkeletonComp type={"longText"} loading={isLoading} />
            </>
            :
            <>
              {appConfig.postview?.showAuthor === 1 ?
                <View style={styles.author_date}>
                  <Image source={{ uri: postData.author[0].avatar }} style={styles.avatar} />
                  <Text.Secondary style={styles.author}>{postData.author[0].display_name}</Text.Secondary>
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={20}
                    color="#5E667C"
                    style={styles.publish_date_icon}
                  />
                  <Text.Secondary style={styles.publish_date}>
                    {postData.post_modified}
                  </Text.Secondary>
                </View> :
                <View style={[styles.author_date, { justifyContent: "flex-end" }]}>
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={20}
                    color="#5E667C"
                    style={styles.publish_date_icon}
                  />
                  <Text.Secondary style={styles.publish_date}>
                    {postData.post_modified}
                  </Text.Secondary>
                </View>
              }
              <View style={styles.mainContent}>
                <Text.H1 style={styles.title}>{postTitle}</Text.H1>
                <RenderHtml contentWidth={width - 50} source={{ html: `<div>${postData.post_content}</div>` }} tagsStyles={tagsStyles} enableCSSInlineProcessing={false} />
              </View>
            </>
          }
          {appConfig.postview?.comments === 1 ?
            <View style={styles.comments}>
              <View style={styles.comments_header}>
                <Text.Primary style={{ fontSize: 16, alignSelf: "flex-start" }}>
                  {t("POST_COMMENTS_HEADER")}
                </Text.Primary>
                <TouchableOpacity onPress={() => navigator.openCommentDetail(post.postId)}>
                  <Text.Primary style={styles.viewComments}>{t("POST_COMMENTS_VIEWALL")}</Text.Primary>
                </TouchableOpacity>
              </View>
              <View>
                {loadingComments ? (
                  <>
                    <CommentSkeleton />
                    <CommentSkeleton />
                    <CommentSkeleton />
                  </>
                ) : (
                  comments.map((comment, index) => (
                    <Comment
                      key={index}
                      commentId={comment.comment_ID}
                      userId={comment.comment_author}
                      avatarUri={comment.author[0]?.avatar ? comment.author[0].avatar : AuthVars.BLANK_IMAGE}
                      comment={comment.comment_content}
                      publishDate={comment.comment_date}
                    />
                  ))
                )}
              </View>
              {appConfig.postview?.addComment === 1 ?
                <TouchableOpacity onPress={() => postComment()}>
                  <Text.Primary style={styles.mainBtn}>{t("POST_COMMENTS_ADD_BTN")}</Text.Primary>
                </TouchableOpacity> : <></> }
            </View> : <></> }
        </View>
      </View>
    </ScrollView>
  );
};

PostDetailScreen.navigationOptions = navigationOptions();

export default PostDetailScreen;
