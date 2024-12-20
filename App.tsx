import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { FormattedProvider } from "react-native-globalize";
import { locale as localeExpo } from "expo-localization";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import * as Notifications from "expo-notifications";
import { getDevicePushTokenAsync } from "expo-notifications";
import { boot as bootDB, getSettings } from "webservice/DB";
import { saveDeviceToken } from "webservice/Push";
import * as Bootstrape from "webservice/Bootstrape";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import * as Device from 'expo-device';

import { LocalizationContext } from "utils";

import AppNavigator from "./app/navigation/Navigator/AppNavigator";
import store from "./app/redux/store";
import { isLogged } from "webservice/Login";

const defaultLanguage = "en";
const defaultLocale = "en-US";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App: React.FC = () => {
  enableScreens();

  const [ready, setReady] = useState(false);
  const [language, setLanguage] = useState(defaultLanguage);

  const [locale, setLocale] = useState(localeExpo);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      //Parse a notification once it is recieved when app is opened
      //alert("tapped!!" + JSON.stringify(notification?.request?.content.data));
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      //Parse a notification once user clicks on it when app is opened
      //alert("tapped 2!!" + JSON.stringify(response?.notification?.request?.content.data));
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    Promise.all([
      SplashScreen.preventAutoHideAsync(),
      Font.loadAsync({
        ...Ionicons.font,
        ...MaterialCommunityIcons.font,
        Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
      }),
      bootDB(),
      Bootstrape.build(),
    ])
      .then((data) => {
        console.log("finished booted up");
        bootedUp(data[3]);
        setReady(true);
      })
      .catch((error) => {
        //Sentry.captureException(error);
        console.log(error);
      });
  }, []);

  const bootedUp = async (config) => {
    await SplashScreen.hideAsync();

    if (Device.isDevice) {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      getSettings("notification", "true").then((notification) => {
        getSettings("location", "false").then(async (location) => {
          if (notification === "true" && config.homepage.autopush === 1) {
            let gpsLocation = { latitude: "", longitude: "" };
            if (location === "true" && config.homepage.autogps === 1) {
              gpsLocation = await getLocation();
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus !== "granted") {
              console.log("Failed to get push token for push notification!");
              return;
            }

            //const token = (await Notifications.getExpoPushTokenAsync()).data;
            //console.log(token);

            getDevicePushTokenAsync().then(async (token) => {
              isLogged().then((userData) => {
                saveDeviceToken(token.data, token.type, userData?.userid, gpsLocation.latitude, gpsLocation.longitude).then((data) => {
                  console.log(data);
                });
              });
            });
          }
        });
      });
    } else {
      console.log("Must use physical device for Push Notifications");
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return { latitude: "", longitude: "" };
    }
    const location = await Location.getCurrentPositionAsync({});
    return { latitude: location.coords.altitude, longitude: location.coords.longitude };
  };

  let body = <View />;

  if (ready) {
    body = (
      <Provider store={store}>
        <FormattedProvider locale={language || defaultLanguage} defaultLocale={"en"}>
          <LocalizationContext.Provider
            value={{
              locale: locale || defaultLocale,
              setLocale: setLocale,
              language: language || defaultLanguage,
              setLanguage: setLanguage,
            }}
          >
            <AppNavigator />
          </LocalizationContext.Provider>
        </FormattedProvider>
      </Provider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {body}
    </SafeAreaProvider>
  );
};

export default App;
