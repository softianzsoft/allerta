import { StyleSheet } from "react-native";

import { Colors } from "style";

export default StyleSheet.create({
  default: {
    paddingHorizontal: 36,
  },
  black: {
    backgroundColor: Colors.grey100,
  },
  red: {
    backgroundColor: Colors.red50,
  },
  blue: {
    backgroundColor: Colors.white,
    borderColor: "#4886c8",
    color: "blue",
    width: "50%",
  },
  fullWidth: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
