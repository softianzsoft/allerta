/* eslint-disable prettier/prettier */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Platform } from "react-native";
import { t } from "utils";
import { Colors, Font } from "style";
import { Icon } from "components";

import HomeNavigator from "./BottomTab/HomeNavigator";
import SettingsNavigator from "./BottomTab/SettingsNavigator";
import CategoriesNavigator from "./BottomTab/CategoriesNavigator";
import SaveNavigator from "./BottomTab/SaveNavigator";
import NotificationNavigator from "./BottomTab/NotficationNavigator";

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = (): React.ReactElement => {
  const { bottom } = useSafeAreaInsets();

  const HomeOptions = {
    tabBarLabel: t("HOME_SCREEN_TAB_NAME"),
    tabBarIcon: ({ focused }) => <Icon fill="none" width="24" height="24"  name={focused ? "Home_active" : "Home"} />,
    headerShown: false,
  };

  const CategoriesOptions = {
    tabBarLabel: t("CATEGORY_NAVIGATION_TITLE"),
    tabBarIcon: ({ focused }) => <Icon fill="none" width="24" height="24"  name={focused ? "Categories_active" : "Categories"}/>,
    headerShown: false,
  };

  const SaveOptions = {
    tabBarLabel: t("SAVE_NAVIGATION_TITLE"),
    tabBarIcon: ({ focused }) => <Icon fill="none" width="24" height="24"  name={focused ? "Save_active" : "Save"} />,
    headerShown: false,
  };

  const NotificationOptions = {
    tabBarLabel: t("NOTIFICATIONS_NAVIGATION_TITLE"),
    tabBarIcon: ({ focused }) => <Icon fill="none" width="24" height="24"  name={focused ? "Notification_active" : "Notification"} />,
    headerShown: false,
  };

  const SettingsOptions = {
    tabBarLabel: t("SETTINGS_NAVIGATION_TITLE"),
    tabBarIcon: ({ focused }) => <Icon fill="none" width="24" height="24"  name={focused ? "Settings_active" : "Settings"} />,
    headerShown: false,
  };

  return (
      <BottomTab.Navigator
      initialRouteName={"HomeNavigator"}
      screenOptions={{
        "tabBarHideOnKeyboard": true,
        "tabBarActiveTintColor": Colors.active,
        "tabBarInactiveTintColor": Colors.inactive,
        "tabBarLabelStyle": {
          "fontFamily": Font.FontFamily.Poppin,
          "fontSize": Font.FontSize.Small+3,
          "lineHeight": Font.FontLineHeight.Secondary,
          "fontWeight": "500",
          "position": "relative"
        },
        "tabBarIconStyle": {
          "marginTop": 10,
          "marginBottom": 8
        },
        "tabBarItemStyle": {
          "paddingVertical": 10
        },
        "tabBarStyle": [
          {
            "display": "flex",
            backgroundColor:Colors.white,
            borderTopWidth: 0,
            shadowColor:"rgba(200, 206, 220, 0.15)",
            shadowOffset:{width:0, height:-10},
            shadowRadius:50,
            elevation:3,
            padding:0,
            height: Platform.OS === "ios" ? 100 : 70,
          },
          null
        ]
      }}
      >
        <BottomTab.Screen name="HomeNavigator" options={HomeOptions} component={HomeNavigator} />
        <BottomTab.Screen name="CategoriesNavigator" options={CategoriesOptions} component={CategoriesNavigator}/>
        <BottomTab.Screen name="SaveNavigator" options={SaveOptions} component={SaveNavigator}/>
        <BottomTab.Screen name="SettingsNavigator"  options={SettingsOptions}  component={SettingsNavigator}/>
      </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
