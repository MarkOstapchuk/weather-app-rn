import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle
} from "react-native";
import { AppColors } from "../constants/Colors";

type fontWeightTypes = "regular" | "bold";

export interface AppTextInterface extends TextProps {
  fontSize?: number;
  fontWeight?: fontWeightTypes;
  toUpperCase?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const AppText: React.FC<AppTextInterface> = ({
  fontSize = 16,
  fontWeight = "regular",
  toUpperCase = false,
  color = AppColors.black,
  style,
  ...rest
}) => {
  return (
    <Text
      allowFontScaling={false}
      style={[
        fontWeightStyle[fontWeight],
        { textTransform: toUpperCase ? "uppercase" : "none", color, fontSize },
        style
      ]}
      {...rest}
    />
  );
};

const fontWeightStyle = StyleSheet.create({
  bold: {
    fontFamily: "Roboto-Bold"
  },
  regular: {
    fontFamily: "Roboto-Regular"
  }
});
