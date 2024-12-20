import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";

import styles from "./HomeNewsListItem.styles";

interface Props {
  postId: number;
  uri: string;
  title: string;
  author: string;
  publish: string;
  onPress: any;
}

const HomeNewsListItem: React.FC<Props> = ({ postId, uri, title, author, publish, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: uri }} style={styles.image} />
      <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.otherInfo}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.publish}>{publish}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HomeNewsListItem;
