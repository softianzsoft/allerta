import React, { useState } from "react";
import { TextInput as TextInputRN, View, TouchableOpacity } from "react-native";

import styles from "./TextInput.styles";
import { Colors } from "style";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  isOptional: boolean;
  secured: boolean;
  placeholder?: string;
  title: string;
  value: string;
  background: string;
  borderColor: string;
  contentType: string;
  keyboardType: string;
  onchange: (txt) => void;
}
const TextInput: React.FC<Props> = ({
  isOptional,
  secured = false,
  value,
  placeholder,
  title,
  background,
  borderColor,
  onchange,
  contentType = "none",
  keyboardType = "default",
}) => {
  const [isVisible, setIsVisible] = useState(!isOptional);
  const [isSecured, setSecuredState] = useState(secured);

  const toggleSecured = () => {
    setSecuredState(!isSecured);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={isOptional ? 0.2 : 1}
        onPress={() => (isOptional ? setIsVisible(!isVisible) : {})}
        style={styles.containerOptionalTitle}
      />
      {isVisible && (
        <TextInputRN
          placeholderTextColor={Colors.grey}
          placeholder={placeholder}
          onChangeText={(txt) => onchange(txt)}
          style={[styles.input, { backgroundColor: background, borderColor: borderColor }]}
          value={value}
          textContentType={contentType}
          secureTextEntry={isSecured}
          keyboardType={keyboardType}
        />
      )}
      {contentType === "password" ?
        <TouchableOpacity style={{ position: "absolute", top: 17, right: 16 }} onPress={toggleSecured}>
          <Ionicons name="eye-outline" size={24} />
        </TouchableOpacity> : <></>
      }
    </View>
  );
};

export default TextInput;
