import { StyleSheet } from "react-native";

import { Layout } from "style";

const styles = StyleSheet.create({
  container: {
    ...Layout.containerWithGradient,
  },
  linearGradient: {
    height: "100%",
    width: 120,
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 0,
  },
  back_btn: {
    position: "absolute",
  },
  header: {
    marginBottom: 26,
    marginTop: 56,
  },
  headerTtle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 27,
  },
  info: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  separator: {
    height: 10,
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
  },
});

export default styles;
