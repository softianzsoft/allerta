import { Layout } from "constant";

const FontFamily = {
  Poppin: "Poppins",
};

const FontWeight = {
  Header: "500",
  Normal: "400",
};

const FontStyle = {
  Header: "normal",
};

const FontSizeNormalDevice = {
  Header: 26,
  H1: 26,
  H2: 28,
  H3: 18,
  Primary: 16,
  Secondary: 14,
  Tertiary: 12,
  Small: 10,
};

const FontSizeSmallDevice = {
  Header: 24,
  H1: 26,
  H2: 22,
  H3: 20,
  Primary: 14,
  Secondary: 12,
  Tertiary: 10,
  Small: 8,
};

const FontLineHeight = {
  Header: 36,
  H1: 28,
  H2: 26,
  H3: 24,
  Primary: 24,
  Secondary: 22,
  Tertiary: 18,
};

const FontSize = Layout.isSmallDevice ? FontSizeSmallDevice : FontSizeNormalDevice;

const Font = { FontWeight, FontSize, FontFamily, FontLineHeight, FontStyle };

export { Font };
