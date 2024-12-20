import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../../../screens/Settings";
import SignInScreen from "../../../screens/SignIn";
import SignUpScreen from "../../../screens/SignUp";
import ForgetPwdScreen from "../../../screens/ForgetPwd";

const Stack = createStackNavigator();

const SettingsNavigator = (): React.ReactElement => (
  <Stack.Navigator>
    <Stack.Screen
      name="Settings"
      options={SettingsScreen.navigationOptions}
      component={SettingsScreen}
    />
    <Stack.Screen
      name="SignInScreen"
      options={SignInScreen.navigationOptions}
      component={SignInScreen}
    />
    <Stack.Screen name="SignUp" options={SignUpScreen.navigationOptions} component={SignUpScreen} />
    <Stack.Screen name="ForgetPwd" options={ForgetPwdScreen.navigationOptions} component={ForgetPwdScreen} />
  </Stack.Navigator>
);

export default SettingsNavigator;
