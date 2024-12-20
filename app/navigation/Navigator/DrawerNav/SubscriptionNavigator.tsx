import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CustomizeNotificationScreen from "../../../screens/CustomizeNotification";
import SubscriptionScreen from "../../../screens/Subscription";
import CustomizeByCategoriesScreen from "../../../screens/CustomizeByCategories";
import SignInScreen from "../../../screens/SignIn";
import SignUpScreen from "../../../screens/SignUp";
import ForgetPwdScreen from "../../../screens/ForgetPwd";

const Stack = createStackNavigator();

const SubscriptionNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen
      name="CategorySelection"
      options={SubscriptionScreen.navigationOptions}
      component={SubscriptionScreen}
    />
    <Stack.Screen
      name="CustomizeNotification"
      options={CustomizeNotificationScreen.navigationOptions}
      component={CustomizeNotificationScreen}
    />
    <Stack.Screen
      name="CustomizeByCategories"
      options={CustomizeByCategoriesScreen.navigationOptions}
      component={CustomizeByCategoriesScreen}
    />
    <Stack.Screen name="SignInScreen" options={SignInScreen.navigationOptions} component={SignInScreen} />
    <Stack.Screen name="SignUp" options={SignUpScreen.navigationOptions} component={SignUpScreen} />
    <Stack.Screen name="ForgetPwd" options={ForgetPwdScreen.navigationOptions} component={ForgetPwdScreen} />
  </Stack.Navigator>
);

export default SubscriptionNavigator;
