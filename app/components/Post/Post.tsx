import React, { PureComponent } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Icon } from "components";

import styles from "./Post.styles";

class Post extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      postId: props.postId,
      isSaved: props.isSaved,
      img_uri: props.img_uri,
      weblink: props.weblink,
      title: props.title,
      publishDate: props.publishDate,
      onPress: props.onPress,
      recommend: props.recommend,
      category: props.category,
    };
  }

  render() {
    const { postId, isSaved, img_uri, title, publishDate, onPress, recommend, weblink, category } = this.state;

    return img_uri !== null ? (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image source={{ uri: img_uri }} style={styles.image} />
        {recommend > 0 ?
          <>
            <View style={styles.recommend} />
            <Icon name="Recommend" fill="none" width="14" height="14" style={styles.recommend_icon} />
            <Text style={styles.recommend_num}>{recommend}</Text>
          </> : <></>}
        <View style={styles.save} />
        <MaterialCommunityIcons name="heart" size={20} color={isSaved ? "#ED5466" : "#FFFFFF"} style={styles.heart_icon} />
        <View style={styles.post_info}>
          <Text style={styles.title}>{title}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {category !== "" ? <Text style={styles.subcategory}>{category}</Text> : <></>}
            <View style={styles.publish}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={14}
                color="#5E667C"
                style={{ letterSpacing: 15 }}
              />
              <Text style={styles.publishDate}>{publishDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.container_noImg} onPress={onPress}>
        {recommend > 0 ?
          <>
            <View style={styles.recommend} />
            <Icon name="Recommend" fill="none" width="14" height="14" style={styles.recommend_icon} />
            <Text style={styles.recommend_num}>{recommend}</Text>
          </> : <></>}
        <View style={styles.save_noImg} />
        <MaterialCommunityIcons name="heart" size={20} color="#ED5466" style={styles.heart_icon} />
        <View style={styles.post_info_noImg}>
          <Text style={styles.title}>{title}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {category !== "" ? <Text style={styles.subcategory}>{category}</Text> : <></>}
            <View style={styles.publish}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={14}
                color="#5E667C"
                style={{ letterSpacing: 15 }}
              />
              <Text style={styles.publishDate}>{publishDate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Post;
