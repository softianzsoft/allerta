import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import styles from "./HomepageBanner.styles";

interface Props {
  uri: string;
  title: string;
  date: string;
  onPress: any;
}

const HomepageBanner: React.FC<Props> = ({ uri, title, date, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: 20 }} onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: uri }} style={styles.image} />
        <LinearGradient colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]} style={styles.overlay} />
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerDate}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={16}
              color="white"
              style={{ letterSpacing: 15 }}
            />
            {date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HomepageBanner;
