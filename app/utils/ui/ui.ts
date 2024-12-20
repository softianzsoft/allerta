import { Appearance, Linking, GestureResponderEvent } from "react-native";

const isDarkModeEnabled = (): boolean => Appearance.getColorScheme() === "dark";

const onHTMLBodyLinkPress = (_: GestureResponderEvent, link: string): void => {
  if (link) {
    Linking.openURL(link);
  }
};

export default {
  isDarkModeEnabled,
  onHTMLBodyLinkPress,
};
