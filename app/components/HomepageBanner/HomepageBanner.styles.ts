import { StyleSheet } from "react-native";

import { Layout, Colors, Font } from "style";

export default StyleSheet.create({
  image: {
    borderRadius: 15,
    width: "100%",
    height: 250,
  },
  container: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    opacity: 0.3,
    backgroundColor: "black",
    width: "100%",
    borderRadius: 15,
    height: "100%",
  },
  bannerContainer: {
    position: "absolute",
    top: "45%",
    left: 15,
    marginRight: 20,
    backgroundColor: "#1D223480",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bannerTitle: {
    color: Colors.white,
    fontWeight: "500",
    fontFamily: Font.FontFamily.Poppin,
    lineHeight: 25,
    marginBottom: 10,
    fontSize: 18,
  },
  bannerDate: {
    color: Colors.white,
    fontWeight: "400",
    fontFamily: Font.FontFamily.Poppin,
    lineHeight: 18,
    fontSize: Font.FontSize.Secondary,
  },
});
