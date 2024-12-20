import { StyleSheet } from "react-native";

import { Colors, Font, Layout } from "style";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  linearGradient: {
    height: "100%",
    width: 120,
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 0,
  },
  header: {
    width: "100%",
    marginTop: 56,
    paddingHorizontal: 20,
  },
  content: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: Colors.transparent,
  },
  comments: {
    marginTop: 25,
  },
  comments_header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  viewComments: {
    alignSelf: "flex-end",
    color: Colors.green,
  },
  newComment: {
    backgroundColor: Colors.white,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    elevation: 1,
    padding: 20,
  },
  postComment: {
    backgroundColor: Colors.darkGreen,
    color: Colors.white,
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 40,
  },
});

export default styles;
