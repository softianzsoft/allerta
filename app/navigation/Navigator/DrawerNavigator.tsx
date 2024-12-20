import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

import { Icon, Text } from "components";
import { Colors, Layout } from "style";

import AppStackNavigator from "./AppStackNavigator";
import styles from "./navigator.styles";
import { t } from "utils";
import * as Bootstrape from "../../webservice/Bootstrape";
import { isLogged } from "webservice/Login";
import CategoriesPostsNavigator from "./DrawerNav/CategoriesPostsNavigator";
import CustomPageScreen from "../../screens/CustomPage/CustomPageScreen";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text.H1 style={Layout.androidNavTitle}>{t("SIDE_MENU_TITLE")}</Text.H1>
        <TouchableOpacity
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name={"close-outline"} size={30} />
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const [appConfig, setAppConfig] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    Bootstrape.load().then((config) => {
      setAppConfig(config);
    });
    isLogged().then((userData) => {
      setUserInfo(userData);
    });
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: isLargeScreen ? null : { width: "70%" },
        headerLeft: (props) => (
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}
            activeOpacity={0.7}
          >
            <Icon
              fill="none"
              width="24"
              height="24"
              name={"Menu"}
              style={{ paddingHorizontal: 30 }}
            />
          </TouchableOpacity>
        ),
        headerShown: false,
        headerStyle: {
          backgroundColor: Colors.white,
          borderWidth: 0,
          elevation: 0,
          height: 72,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: Colors.red,
        },
        drawerItemStyle: {
          width: "100%",
          marginLeft: 0,
          borderRadius: 0,
        },
        drawerInactiveBackgroundColor: Colors.white,
        drawerActiveBackgroundColor: Colors.lightGreen,
        drawerActiveTintColor: Colors.green,
      })}
    >
      <Drawer.Screen
        name="Home"
        component={AppStackNavigator}
        options={{
          title: t("SIDE_MENU_HOME_ITEM"),
          drawerIcon: ({ focused, size }) => (
            <Icon
              fill="none"
              width="24"
              height="24"
              name={focused ? "Home_active" : "Home"}
              style={{ marginRight: -20 }}
            />
          ),
        }}
      />
      {appConfig.menu?.categories?.length > 0 ? appConfig.menu.categories.map((category) => (
          <Drawer.Screen
            key={category.id}
            name={"Category" + category.id}
            component={CategoriesPostsNavigator}
            initialParams={{ id: category.id, name: category.name, action: "list" }}
            options={{
              title: category.name,
              headerShown: false,
              drawerIcon: ({ focused, size }) => (
                <Icon
                  fill="none"
                  width="24"
                  height="24"
                  name={focused ? "Categories_active" : "Categories"}
                  style={{ marginRight: -20 }}
                />
              ),
            }}
          />
      )) : <></> }
        {appConfig.menu?.pages?.length > 0 ? appConfig.menu.pages.map((page) => (
          <Drawer.Screen
            key={page.ID}
            name={"CustomPage" + page.ID}
            component={CustomPageScreen}
            initialParams={{ pageID: page.ID, title: page.post_excerpt }}
            options={{
              title: page.post_excerpt,
              headerShown: false,
              drawerIcon: ({ focused, size }) => (
                <Icon
                  fill="none"
                  width="24"
                  height="24"
                  name={focused ? "Categories_active" : "Categories"}
                  style={{ marginRight: -20 }}
                />
              ),
            }}
          />
        )) : <></> }
      <Drawer.Screen
        name={"CategoryReqService"}
        component={CategoriesPostsNavigator}
        initialParams={{ id: 207, name: t("SIDE_MENU_REQUEST_SERVICE"), action: "list" }}
        options={{
          drawerItemStyle: {
            backgroundColor: "yellow",
          },
          title: t("SIDE_MENU_REQUEST_SERVICE"),
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <Ionicons name="help-buoy" size={24} color={focused ? "#33A759" : "#8E9BB7"} style={{ marginRight: -20 }} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
