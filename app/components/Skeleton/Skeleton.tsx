import React from "react";
import { View } from "react-native";

import styles from "./Skeleton.styles";

interface Props {
  type: string;
  width: number;
  height: number;
  loading: boolean;
  style: any;
}

const SkeletonComp: React.FC<Props> = ({ type, loading, width, height, style = [] }) => {
  const Spacer = ({ height = 5 }) => <View style={{ height }} />;

  return (
    type === "longText" ?
    <>
      <View style={styles.text} />
      <Spacer />
      <View style={styles.text} />
      <Spacer />
      <View style={[styles.text, { width: "70%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "60%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "50%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "60%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "70%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "90%" }]} />
      <Spacer />
      <View style={[styles.text, { width: "80%" }]} />
    </>
    : type === "image" ? <View style={[styles.image, style]} />
    : type === "slider" ? <View style={[styles.slider, { width: width, height: height }, style]} />
    : type === "text" ? <View style={[styles.word, { width: width, height: height }, style]} />
    : <></>
  );
};

export default SkeletonComp;
