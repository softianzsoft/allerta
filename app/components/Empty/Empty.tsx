import React from "react";
import { View, useWindowDimensions } from "react-native";

import styles from "./Empty.styles";
import { Colors } from "style";
import { Entypo } from "@expo/vector-icons";
import { Text } from "components";

interface Props {
  description: string;
}
const Empty: React.FC<Props> = ({ description }) => {
  const { height, width } = useWindowDimensions();

  return (
    <View style={[styles.container, { height: height / 2 }]}>
      <Entypo name="archive" size={128} color={Colors.grey70} />
      <Text.Primary style={{ marginTop: 10 }}>{description}</Text.Primary>
    </View>
  );
};

export default Empty;
