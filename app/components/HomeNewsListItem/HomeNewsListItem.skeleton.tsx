import React from "react";
import { View } from "react-native";

import styles from "./HomeNewsListItem.styles";
import Skeleton from "components/Skeleton/Skeleton";

const HomeNewsListSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton type={"image"} style={styles.image} />
      <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Skeleton type={"text"} height={20} style={styles.title} />
        <View style={styles.otherInfo}>
          <Skeleton type={"text"} width={80} height={20} style={styles.author} />
          <Skeleton type={"text"} width={80} height={20} style={styles.publish} />
        </View>
      </View>
    </View>
  );
};

export default HomeNewsListSkeleton;
