import { StyleSheet } from "react-native";

import { Colors, Font } from "style";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    alignItems: "center",
    borderRadius: 10,
    height: 70,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    textTransform: "capitalize",
    color: Colors.white,
    position: "absolute",
    top: 21,
    left: 18,
    fontFamily: Font.FontFamily.Poppin,
    fontSize: Font.FontSize.H3,
    fontWeight: "500",
    lineHeight: Font.FontLineHeight.H2,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 3,
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  detail: {
    position: "absolute",
    top: 25,
    right: 24,
  },
});
