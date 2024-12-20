import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "./Comment.styles";

const CommentSkeleton: React.FC<Props> = () => {
  const Spacer = ({ height = 9 }) => <View style={{ height }} />;
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.user_info}>
        <View style={[styles.avatar, { width: 30, height: 30, borderRadius: 50, backgroundColor: "#8C8D8B", opacity: 0.5 }]} />
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={styles.userId}>
            <View style={{ width: 60, height: 15, backgroundColor: "#8C8D8B", opacity: 0.5 }} />
          </Text>
          <View style={styles.publishDate}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={14}
              color="#5E667C"
              style={{ textAlignVertical: "center", marginRight: 7 }}
            />
            <Text style={{ color: "#5E667C", fontSize: 12 }}>
              <View style={{ width: 50, height: 15, backgroundColor: "#8C8D8B", opacity: 0.5 }} />
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.content}>
        <View style={{ width: width - 50, height: 15, backgroundColor: "#8C8D8B", opacity: 0.5 }} />
        <Spacer />
        <View style={{ width: width - 50, height: 15, backgroundColor: "#8C8D8B", opacity: 0.5 }} />
        <Spacer />
        <View style={{ width: width / 2, height: 15, backgroundColor: "#8C8D8B", opacity: 0.5 }} />
      </Text>
    </View>
  );
};

export default CommentSkeleton;
