import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";

import { Font } from "style";

import styles from "./Button.styles";
import mainStyle from "./styles";

const PADDING_VERTICAL = 12;

type ButtonType = "Primary" | "Secondary";

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  fullWidth?: boolean;
  textType: ButtonType;
  black?: boolean;
  red?: boolean;
  blue?: boolean;
  lessRadius?: boolean;
  onPress: () => void;
};

interface ButtonFactory {
  (type: ButtonType): React.FC<Props>;
}

const buttonFactory: ButtonFactory = (type) => (props) => {
  const customStyle = [mainStyle.default, styles[type].default, props.style];
  const { fullWidth, children, textType, black, red, blue, onPress, lessRadius } = props;

  if (fullWidth) {
    customStyle.push(mainStyle.fullWidth);
  }

  if (black) {
    customStyle.push(mainStyle.black);
  }

  if (red) {
    customStyle.push(mainStyle.red);
  }

  if (blue) {
    customStyle.push(mainStyle.blue);
  }

  const additionalStyle = {
    paddingVertical: PADDING_VERTICAL,
    borderRadius: lessRadius ? 5 : PADDING_VERTICAL * 2 + Font.FontSize[textType],
  };

  return (
    <TouchableOpacity onPress={onPress} {...props} style={[customStyle, additionalStyle]}>
      {children}
    </TouchableOpacity>
  );
};

const Primary = buttonFactory("Primary");
const Secondary = buttonFactory("Secondary");

export default { Primary, Secondary };
